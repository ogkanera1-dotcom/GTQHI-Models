function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("ルイトAI")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}
