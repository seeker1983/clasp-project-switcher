const EXECUTE_HANDLERS = {
  update: sheet => generateExportUrl(sheet, 'update'),
  load: sheet => generateExportUrl(sheet, 'load'),
  setTitle: sheet => setTitle(sheet)
};

function execute(action, data) {
  var handler = _.get(EXECUTE_HANDLERS, action, null);
  return handler && handler(data);
}

function test_execute() {
  var sheet = SpreadsheetApp.openById('1qHNK8IxARCedG5cLeUYbSXjzEBfBzpkoX0mopH0OdNQ').getSheetByName('Détail Visa Plan VDC');
  console.log(execute('updateList', sheet));
}