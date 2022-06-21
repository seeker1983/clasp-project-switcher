function renderListModal() {
    var template = HtmlService.createTemplateFromFile('modal')
    template.data = {
      data : {}
    };
    return template.evaluate().setWidth(600).setHeight(250);
}

function displayExportSelectedDialog() {
    var template = HtmlService.createTemplateFromFile('modal-selected')
    template.data = {
//      link : generateExportSelectedUrl()
    };
    return template.evaluate().setWidth(600).setHeight(250);
}

function updateListModal() {
  SpreadsheetApp.getUi().showModalDialog(renderListModal(), 'Processing...')
}
