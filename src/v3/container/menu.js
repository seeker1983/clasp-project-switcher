function onOpen() {
  SpreadsheetApp.getUi().createMenu('BIM Intelligence')
    .addItem('Mise à jour du tableau', 'displayUpdateListDialog')
    .addItem('Créer un bordereau', 'displayExportSelectedDialog')
    .addItem('Supprimer les filtres', 'ClearFilter')
    .addToUi();
}

function displayUpdateListDialog() {
  return ProductionFolderListLib.displayUpdateListDialog();
}

function displayExportSelectedDialog() {
  return ProductionFolderListLib.displayExportSelectedDialog();
}

function ClearFilter() {
  return new ProductionFolderListLib.FilterService(SpreadsheetApp.getActiveSheet()).clear();
}

/* For internal use of dialogs */
function execute(fn, options) {
  return ProductionFolderListLib.execute(fn, options);
}


