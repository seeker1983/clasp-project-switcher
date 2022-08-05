function generateExportSelectedUrl() {
  var lastRow = SpreadsheetApp.getActiveRange().getLastRow();
  var firstRow = SpreadsheetApp.getActiveRange().getRow();
  var range = SpreadsheetApp.getActiveSheet().getRange(firstRow, 4, lastRow - firstRow + 1, SpreadsheetApp.getActiveSheet().getLastColumn() - 3).getA1Notation();

  return new ExportService(SpreadsheetApp.getActiveSheet()).getExportUrl(range);
}

function displayExportSelectedDialog() {
    var template = HtmlService.createTemplateFromFile('html/exportSelected')
    _.assign(template, {
      link : generateExportSelectedUrl(),
      name: SpreadsheetApp.getActiveSheet().getRange('D1').getValue().replace(/[\n\r].*/g,'')
    });
    var html = template.evaluate().setWidth(800).setHeight(450);
    SpreadsheetApp.getUi().showModalDialog(html, 'Génération d\'un bordereau ...')
}

function test_exportRange() {
  var sheet = SpreadsheetApp.openById('1qHNK8IxARCedG5cLeUYbSXjzEBfBzpkoX0mopH0OdNQ').getSheetByName('Détail Visa Plan VDC');
  console.log(sheet.getActiveRange().getA1Notation)
}

