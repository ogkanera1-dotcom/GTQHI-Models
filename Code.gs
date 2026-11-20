function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("ルイトAI")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function getCurrentUser() {
  return Session.getActiveUser().getEmail() || "Googleアカウントで利用中";
}

function saveEditedImage(image) {
  if (!image || typeof image.dataUrl !== "string") {
    throw new Error("保存する画像がありません。");
  }

  var match = image.dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    throw new Error("対応していない画像形式です。");
  }

  var bytes = Utilities.base64Decode(match[2]);
  if (bytes.length > 4 * 1024 * 1024) {
    throw new Error("画像は4MB以下にしてください。");
  }

  var safeName = String(image.name || "edited-image")
    .replace(/\.[^.]+$/, "")
    .replace(/[\\/:*?\"<>|]/g, "_")
    .substring(0, 80);
  var extension = match[1] === "image/png" ? ".png" : match[1] === "image/webp" ? ".webp" : ".jpg";
  var blob = Utilities.newBlob(bytes, match[1], safeName + extension);
  var folder = getOrCreateImageFolder_();
  var file = folder.createFile(blob);

  return { name: file.getName(), url: file.getUrl() };
}

function getOrCreateImageFolder_() {
  var properties = PropertiesService.getUserProperties();
  var folderId = properties.getProperty("RUITO_PHOTOS_FOLDER_ID");
  if (folderId) {
    try {
      return DriveApp.getFolderById(folderId);
    } catch (error) {
      // Re-create the folder if it was deleted or access was revoked.
    }
  }

  var folder = DriveApp.createFolder("ルイトAI 写真");
  properties.setProperty("RUITO_PHOTOS_FOLDER_ID", folder.getId());
  return folder;
}
