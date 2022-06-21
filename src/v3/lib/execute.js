const EXECUTE_HANDLERS = {
  getExportUrl: sheet => generateExportUrl(sheet),
  updateListModal: () => updateListModal(),
  action1: data => console.log(data),
  action2: data => console.log(data),
  action3: data => console.log(data),
  action4: data => console.log(data),
  action5: data => console.log(data)
};

function execute(action, data) {
  var handler = _.get(EXECUTE_HANDLERS, action, null);
  return handler && handler(data);
}

function test_execute() {
  var sheet = SpreadsheetApp.openById('1qHNK8IxARCedG5cLeUYbSXjzEBfBzpkoX0mopH0OdNQ').getSheetByName('Détail Visa Plan VDC');
  console.log(execute('updateList', sheet));
}