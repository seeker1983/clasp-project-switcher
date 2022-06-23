function displayUpdateListDialog() {
  var template = HtmlService.createTemplateFromFile('html/updateList')
  var html = template.evaluate().setWidth(600).setHeight(250);

  SpreadsheetApp.getUi().showModalDialog(html, 'Processing...')
}
