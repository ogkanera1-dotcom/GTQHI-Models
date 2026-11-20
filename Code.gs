/**
 * RUITO AI — Google Apps Script backend.
 * Apps Script is suitable for a small demo, not a high-traffic real-time service.
 * See APPS_SCRIPT_SETUP.md for clasp synchronization.
 */
var APP_CONFIG = {
  title: "ルイトAI",
  maxUsers: 250,
  maxMessages: 80,
  maxMessageLength: 500,
  maxImageBytes: 4 * 1024 * 1024,
  sessionSeconds: 21600,
  presenceSeconds: 45
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle(APP_CONFIG.title)
    .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1");
}

/** Create a demo account. Do not use this custom auth for production accounts. */
function registerAccount(username, password) {
  username = normalizeUsername_(username);
  validatePassword_(password);

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var props = PropertiesService.getScriptProperties();
    var users = readJson_(props.getProperty("RUITO_USERS"), []);
    if (users.length >= APP_CONFIG.maxUsers) {
      throw new Error("このデモの登録人数上限に達しました。");
    }
    if (users.some(function (name) { return name.toLowerCase() === username.toLowerCase(); })) {
      throw new Error("そのユーザー名はすでに使われています。");
    }

    var salt = Utilities.getUuid();
    props.setProperty(accountPropertyKey_(username), JSON.stringify({
      salt: salt,
      hash: passwordHash_(salt, password),
      createdAt: Date.now()
    }));
    users.push(username);
    props.setProperty("RUITO_USERS", JSON.stringify(users));
  } finally {
    lock.releaseLock();
  }
  return createSession_(username);
}

function loginAccount(username, password) {
  username = normalizeUsername_(username);
  if (typeof password !== "string" || password.length > 200) {
    throw new Error("ユーザー名またはパスワードが違います。");
  }

  var cache = CacheService.getScriptCache();
  var rateKey = "login-fail:" + accountPropertyKey_(username);
  var failures = Number(cache.get(rateKey) || 0);
  if (failures >= 8) {
    throw new Error("ログイン試行が多すぎます。しばらくしてから再試行してください。");
  }

  var raw = PropertiesService.getScriptProperties().getProperty(accountPropertyKey_(username));
  var record = raw ? readJson_(raw, null) : null;
  if (!record || passwordHash_(record.salt, password) !== record.hash) {
    cache.put(rateKey, String(failures + 1), 300);
    throw new Error("ユーザー名またはパスワードが違います。");
  }
  cache.remove(rateKey);
  return createSession_(username);
}

function createSession_(username) {
  var token = Utilities.getUuid() + Utilities.getUuid();
  CacheService.getScriptCache().put("session:" + token, username, APP_CONFIG.sessionSeconds);
  return { token: token, username: username };
}

function logoutAccount(token) {
  if (typeof token === "string") {
    var username = getSessionUsername_(token);
    CacheService.getScriptCache().remove("session:" + token);
    if (username) CacheService.getScriptCache().remove("online:" + accountPropertyKey_(username));
  }
  return true;
}

/** Heartbeat, chat history and online roster. Client polls this lightweight endpoint. */
function getAppState(token) {
  var username = requireSession_(token);
  var cache = CacheService.getScriptCache();
  var key = accountPropertyKey_(username);
  cache.put("online:" + key, JSON.stringify({ name: username, lastSeen: Date.now() }), APP_CONFIG.presenceSeconds);

  var users = readJson_(PropertiesService.getScriptProperties().getProperty("RUITO_USERS"), []);
  var online = [];
  users.forEach(function (name) {
    var presence = cache.get("online:" + accountPropertyKey_(name));
    if (presence) {
      var parsed = readJson_(presence, null);
      if (parsed && parsed.name) online.push(parsed.name);
    }
  });

  var messages = readJson_(cache.get("chat:messages"), []);
  return {
    username: username,
    playerCount: users.length,
    onlineCount: online.length,
    onlinePlayers: online,
    messages: messages
  };
}

function sendChatMessage(token, text) {
  var username = requireSession_(token);
  text = String(text || "").trim();
  if (!text) throw new Error("メッセージを入力してください。");
  if (text.length > APP_CONFIG.maxMessageLength) throw new Error("メッセージは500文字以内にしてください。");

  var cache = CacheService.getScriptCache();
  var sendKey = "chat-send:" + accountPropertyKey_(username);
  if (cache.get(sendKey)) throw new Error("送信が速すぎます。少し待ってください。");
  cache.put(sendKey, "1", 1);

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var messages = readJson_(cache.get("chat:messages"), []);
    messages.push({ username: username, text: text, time: Date.now() });
    if (messages.length > APP_CONFIG.maxMessages) {
      messages = messages.slice(-APP_CONFIG.maxMessages);
    }
    cache.put("chat:messages", JSON.stringify(messages), APP_CONFIG.sessionSeconds);
  } finally {
    lock.releaseLock();
  }
  return true;
}

/** Save a browser-rendered image. Video export stays on the user's device. */
function saveEditedImage(image) {
  if (!image || typeof image !== "object") throw new Error("画像データがありません。");
  var username = requireSession_(image.token);
  if (typeof image.dataUrl !== "string") throw new Error("画像データがありません。");

  var match = image.dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("対応していない画像形式です。");
  var bytes = Utilities.base64Decode(match[2]);
  if (bytes.length > APP_CONFIG.maxImageBytes) throw new Error("画像は4MB以下にしてください。");

  var safeName = String(image.name || "edited-image")
    .replace(/\.[^.]+$/, "")
    .replace(/[\\/:*?"<>|]/g, "_")
    .substring(0, 80);
  var extension = match[1] === "image/png" ? ".png" : match[1] === "image/webp" ? ".webp" : ".jpg";
  var folder = getOrCreateImageFolder_(username);
  var file = folder.createFile(Utilities.newBlob(bytes, match[1], safeName + extension));
  return { name: file.getName(), url: file.getUrl() };
}

function getOrCreateImageFolder_(username) {
  var props = PropertiesService.getScriptProperties();
  var propertyKey = "RUITO_PHOTOS_FOLDER_" + accountPropertyKey_(username).replace("account:", "");
  var folderId = props.getProperty(propertyKey);
  if (folderId) {
    try { return DriveApp.getFolderById(folderId); } catch (error) { /* recreate */ }
  }
  var folder = DriveApp.createFolder("ルイトAI 写真 - " + username);
  props.setProperty(propertyKey, folder.getId());
  return folder;
}

function requireSession_(token) {
  var username = getSessionUsername_(token);
  if (!username) throw new Error("ログインの有効期限が切れました。もう一度ログインしてください。");
  return username;
}

function getSessionUsername_(token) {
  if (typeof token !== "string" || !/^[0-9a-f-]{60,80}$/i.test(token)) return null;
  return CacheService.getScriptCache().get("session:" + token);
}

function normalizeUsername_(username) {
  username = String(username || "").trim();
  if (!/^[A-Za-z0-9_-]{3,20}$/.test(username)) {
    throw new Error("ユーザー名は半角英数字、_、- の3〜20文字にしてください。");
  }
  return username;
}

function validatePassword_(password) {
  if (typeof password !== "string" || password.length < 8 || password.length > 200) {
    throw new Error("パスワードは8〜200文字にしてください。");
  }
}

function accountPropertyKey_(username) {
  return "account:" + Utilities.base64EncodeWebSafe(username.toLowerCase());
}

function passwordHash_(salt, password) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    salt + "\n" + password,
    Utilities.Charset.UTF_8
  );
  return Utilities.base64Encode(bytes);
}

function readJson_(value, fallback) {
  if (!value) return fallback;
  try { return JSON.parse(value); } catch (error) { return fallback; }
}
