function displayUpdateListDialog() {
  return displayActionDialog('load');
}

function displayUpdateNameDialog() {
  return displayActionDialog('update');
}

function displayActionDialog(action) {
  var template = HtmlService.createTemplateFromFile('html/updateList')
  template.action = action;
  var html = template.evaluate().setWidth(600).setHeight(250);

  SpreadsheetApp.getUi().showModalDialog(html, 'Analyse en cours...')
}
