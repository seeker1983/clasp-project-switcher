function renderListModal() {
    var template = HtmlService.createTemplateFromFile('modal')
    template.data = {
      data : {}
    };
    return template.evaluate().setWidth(600).setHeight(250);
}

function updateListModal() {
  SpreadsheetApp.getUi().showModalDialog(renderListModal(), 'Processing...')
}
