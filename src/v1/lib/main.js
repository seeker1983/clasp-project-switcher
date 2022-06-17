/* These columns will be updated on every run for already existing files */
const UPDATE_COLUMN_LIST = ["File Name", "Path", "Folder link", "Last Update date", "Owner", "Deleted"];

function listFolders() {
  updateList(SpreadsheetApp.getActiveSheet());
}

var logSheet = false;

function Update1() {
  var ss = SpreadsheetApp.openById('189gI5Ff_HBxOf4TNVIZruqY0JdbpijV5EtHC7M8iEKo')
  logSheet = new KSheet(ss.getSheetByName("Log"));
  updateList(ss.getSheetByName("Logging Test"));
}

function logEvent(Event, row) {
  logSheet = logSheet || new KSheet("Log");
  logSheet.appendRow(_.assign(row, {Event, Date: new Date()}))
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

function updateList(sheet) {
  var ksheet = new KSheet(sheet, {skipBefore:1, skipAfter:1});

  var rows = ksheet.load();
  
  var folderId = sheet.getRange("I1").getRichTextValue().getLinkUrl()
    .replace(/\?.*/, "")
    .replace('https://drive.google.com/drive/folders/','');
  Logger.log(folderId)
  var folder = DriveApp.getFolderById(folderId);
  
  var list = recursiveList(folder);
  
  var items = list.map(item => ({
    	"Google Drive ID" : item.file.getId(),
      "File Name" : item.file.getName(),
      "File Link" : item.file.getUrl(),
      "Path" : item.path,
      "Folder link" : item.folder.getUrl(),
      "Last Update date" : item.file.getLastUpdated(),
      "MimeType" : item.file.getMimeType(),
      "Creation Date" : item.file.getDateCreated(),
      "Owner" : item.file.getOwner().getEmail(),
      "Deleted" : item.file.isTrashed(),
  }));

  var existingRows = _.keyBy(rows, "Google Drive ID");
  var existingItems = _.keyBy(items, "Google Drive ID");

  if(ksheet.numRows == 0) {
    ksheet.saveRows(items);
  } else {
    /* Update File Names */
    _.intersectionBy(rows, items, "Google Drive ID").map(row => {
      var oldName = existingItems[row["Google Drive ID"]]["File Name"];
      
      var newName = row["File Name Link"];
      if(oldName !== newName && row["File Name Link"] != row["File Name"]) {
        Logger.log(`Renaming ${oldName} to ${newName}`)
        DriveApp.getFileById(row["Google Drive ID"]).setName(newName);

        /*var rowNumber = _.findIndex(rows, _r => row['Google Drive ID'] == _r['Google Drive ID']) + ksheet.startRow;
        sheet.getRange(rowNumber, ksheet.findColumn("File Name")).setValue(newName);
        sheet.getRange(rowNumber, ksheet.findColumn("File Name Link")).setRichTextValue(
          SpreadsheetApp.newRichTextValue().setText(newName).setLinkUrl(row["File Link"]).build()
        );*/

        logEvent('RENAME', row);
        row['File Name'] = row['File Name Link'] = existingItems[row["Google Drive ID"]]["File Name"] = newName;      
        Logger.log(row)  
      }
    });
    /* Update */
    rows.map(row => _.assign(row, _.get(existingItems, row["Google Drive ID"], {})));

    /* Delete */
    _.filter(_.differenceBy(rows, items, "Google Drive ID"),row => !row['Deleted'])
      .map(row => (row["Deleted"] = true, logEvent('DELETE', row)));

    UPDATE_COLUMN_LIST.map(columnName => ksheet.saveRowsColumn(columnName, rows));

    /* Insert */
    var newItems = _.differenceBy(items, rows, "Google Drive ID");

    if(newItems.length > 0 ) {
      /* Hide Filter */
      ksheet.pushFilter();

      /* Insert Items */
      newItems.map((item, index) => {
        ksheet.appendRow(item);
        Logger.log(`Inserting ${index}/${newItems.length}`);
        logEvent('NEW', item);
      });

      /* Copy format for inserted */
      var formatRowRange = sheet.getRange(ksheet.startRow, 1,1, sheet.getLastColumn());  
      formatRowRange.copyTo(sheet.getRange(sheet.getLastRow() - newItems.length+1, 1, newItems.length, sheet.getLastColumn()), {formatOnly:true});

      /* Enlong Formulas */  
      var formulas = sheet.getRange(ksheet.startRow, 1,1, sheet.getLastColumn()).getFormulas()[0];
      var formula_columns = _.map(_.keys(_.pickBy(formulas, v=>v!="")), Number).map(v=>v+1);
      formula_columns.map(columnIndex => {
          var formulaCell = sheet.getRange(ksheet.startRow, columnIndex);
          var newFormulaRange = sheet.getRange(sheet.getLastRow() - newItems.length+1, columnIndex, newItems.length, 1);
          formulaCell.copyTo(newFormulaRange);
      });

      /* Restore Filter */
      ksheet.popFilter();
    }
    var allRows = _.concat(rows, newItems);

    ([ 
      {
        linkColumnName: "File Name Link",
        nameColumnName: "File Name",
        urlColumnName: "File Link",
      },
      {
        linkColumnName: "Folder Name Link",
        nameColumnName: "Path",
        urlColumnName: "Folder link",
      }
    ]).map(richlink => {
      ksheet.saveRichColumn(richlink.linkColumnName, allRows.map(row =>
        SpreadsheetApp.newRichTextValue().setText(row[richlink.nameColumnName]).setLinkUrl(row[richlink.urlColumnName]).build()));
    })

  }

  
  }



