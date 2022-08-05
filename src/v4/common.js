/* These columns will be updated on every run for already existing files */
const UPDATE_COLUMN_LIST = ["File Name", "Path", "Folder link", "Last Update date", "Owner", "Deleted"];

function listFolders() {
  updateList(SpreadsheetApp.getActiveSheet());
}

var logSheet = false;

function Update1() {
  var ss = SpreadsheetApp.openById('189gI5Ff_HBxOf4TNVIZruqY0JdbpijV5EtHC7M8iEKo')
  logSheet = new KSheet(ss.getSheetByName("Log"));
  updateList(ss.getSheetByName("Synthèse Visa FP VDC"));
}

function logEvent(Event, row) {
  console.log(Event, row)
//  logSheet = logSheet || new KSheet("Log");
//  logSheet.appendRow(_.assign(row, {Event, Date: new Date()}))
}


function clog(v) {return Logger.log(JSON.stringify(v, null, 2))};

function listIterator(it) {
  var items = [];
  while(it.hasNext()) items.push(it.next());
  return items;
}

function recursiveList(folder, path="") {
  var files = listIterator(folder.getFiles());

  Logger.log(folder.getName());

  var rootFiles = files.map(file => ({
    path: path + folder.getName(),
    file,
    folder,
    fname: file.getName()
  }));

  var subFolders = listIterator(folder.getFolders());
  var subFiles = subFolders.map(subFolder => recursiveList(subFolder, path + folder.getName() + "/"));

  return _.concat(rootFiles, _.flatten(subFiles));
}

