function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("ルイトAI")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

// Demo account system for a small Apps Script deployment. Passwords are salted and hashed;
// do not use this lightweight authentication as a substitute for a production identity provider.
function registerAccount(username, password) {
  username = normalizeUsername_(username);
  validatePassword_(password);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var props = PropertiesService.getScriptProperties();
    var roster = JSON.parse(props.getProperty("RUITO_USERS") || "[]");
    if (roster.length >= 250) throw new Error("このデモの登録人数上限に達しました。");
    if (roster.some(function (name) { return name.toLowerCase() === username.toLowerCase(); })) {
      throw new Error("そのユーザー名はすでに使われています。");
    }
    var salt = Utilities.getUuid();
    props.setProperty(accountPropertyKey_(username), JSON.stringify({ salt: salt, hash: passwordHash_(salt, password) }));
    roster.push(username);
    props.setProperty("RUITO_USERS", JSON.stringify(roster));
  } finally {
    lock.releaseLock();
  }
  return createSession_(username);
}

function loginAccount(username, password) {
  username = normalizeUsername_(username);
  if (typeof password !== "string" || password.length > 200) throw new Error("ユーザー名またはパスワードが違います。");
  var cache = CacheService.getScriptCache();
  var rateKey = "login-fail:" + accountPropertyKey_(username);
  var failures = Number(cache.get(rateKey) || 0);
  if (failures >= 8) throw new Error("ログイン試行が多すぎます。しばらくしてから再試行してください。");

  var record = PropertiesService.getScriptProperties().getProperty(accountPropertyKey_(username));
  if (!record) {
    cache.put(rateKey, String(failures + 1), 300);
    throw new Error("ユーザー名またはパスワードが違います。");
  }
  record = JSON.parse(record);
  if (passwordHash_(record.salt, password) !== record.hash) {
    cache.put(rateKey, String(failures + 1), 300);
    throw new Error("ユーザー名またはパスワードが違います。");
  }
  cache.remove(rateKey);
  return createSession_(username);
}

function createSession_(username) {
  var token = Utilities.getUuid() + Utilities.getUuid();
  CacheService.getScriptCache().put("session:" + token, username, 21600);
  return { token: token, username: username };
}

function logoutAccount(token) {
  var username = getSessionUsername_(token);
  if (username) CacheService.getScriptCache().remove("session:" + token);
  return true;
}

function getAppState(token) {
  var username = requireSession_(token);
  var cache = CacheService.getScriptCache();
  var userKey = accountPropertyKey_(username);
  cache.put("online:" + userKey, JSON.stringify({ name: username, lastSeen: Date.now() }), 45);

  var roster = JSON.parse(PropertiesService.getScriptProperties().getProperty("RUITO_USERS") || "[]");
  var online = [];
  roster.forEach(function (name) {
    var presence = cache.get("online:" + accountPropertyKey_(name));
    if (presence) {
      try { online.push(JSON.parse(presence).name); } catch (e) {}
    }
  });

  var messages = [];
  try { messages = JSON.parse(cache.get("chat:messages") || "[]"); } catch (e) { messages = []; }
  return { username: username, playerCount: roster.length, onlineCount: online.length, onlinePlayers: online, messages: messages };
}

function sendChatMessage(token, text) {
  var username = requireSession_(token);
  text = String(text || "").trim();
  if (!text) throw new Error("メッセージを入力してください。");
  if (text.length > 500) throw new Error("メッセージは500文字以内にしてください。");

  var cache = CacheService.getScriptCache();
  var sendKey = "chat-send:" + accountPropertyKey_(username);
  if (cache.get(sendKey)) throw new Error("送信が速すぎます。少し待ってください。");
  cache.put(sendKey, "1", 1);

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var messages = [];
    try { messages = JSON.parse(cache.get("chat:messages") || "[]"); } catch (e) {}
    messages.push({ username: username, text: text, time: Date.now() });
    if (messages.length > 80) messages = messages.slice(-80);
    cache.put("chat:messages", JSON.stringify(messages), 21600);
  } finally {
    lock.releaseLock();
  }
  return true;
}

function saveEditedImage(image) {
  requireSession_(image && image.token);
  if (!image || typeof image.dataUrl !== "string") throw new Error("保存する画像があり��せん。");
  var match = image.dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("対応していない画像形式です。");
  var bytes = Utilities.base64Decode(match[2]);
  if (bytes.length > 4 * 1024 * 1024) throw new Error("画像は4MB以下にしてください。");

  var safeName = String(image.name || "edited-image").replace(/\.[^.]+$/, "").replace(/[\\/:*?\"<>|]/g, "_").substring(0, 80);
  var extension = match[1] === "image/png" ? ".png" : match[1] === "image/webp" ? ".webp" : ".jpg";
  var file = getOrCreateImageFolder_().createFile(Utilities.newBlob(bytes, match[1], safeName + extension));
  return { name: file.getName(), url: file.getUrl() };
}

function getOrCreateImageFolder_() {
  var properties = PropertiesService.getUserProperties();
  var folderId = properties.getProperty("RUITO_PHOTOS_FOLDER_ID");
  if (folderId) {
    try { return DriveApp.getFolderById(folderId); } catch (error) {}
  }
  var folder = DriveApp.createFolder("ルイトAI 写真");
  properties.setProperty("RUITO_PHOTOS_FOLDER_ID", folder.getId());
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
  if (!/^[A-Za-z0-9_-]{3,20}$/.test(username)) throw new Error("ユーザー名は半角英数字、_、- の3〜20文字にしてください。");
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
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + "\n" + password, Utilities.Charset.UTF_8);
  return Utilities.base64Encode(bytes);
}
