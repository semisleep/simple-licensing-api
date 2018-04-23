function datenum(v, date1904) {
  if (date1904) {
    v += 1462;
  }
  let epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheetFromArrayOfArrays(data) {
  // include 3rd party libs only when they are needed
  const XLSX = require ('xlsx');

  let ws = {};
  let range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
  for (let R = 0; R != data.length; ++R) {
    for (let C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) {
        range.s.r = R;
      }
      if (range.s.c > C) {
        range.s.c = C;
      }
      if (range.e.r < R) {
        range.e.r = R;
      }
      if (range.e.c < C) {
        range.e.c = C;
      }
      let cell = {v: data[R][C]};
      if (cell.v === null) {
        continue;
      }
      let cell_ref = XLSX.utils.encode_cell({c: C, r: R});

      if (typeof cell.v === 'number') {
        cell.t = 'n';
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b';
      } else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else {
        cell.t = 's';
      }

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) {
    ws['!ref'] = XLSX.utils.encode_range(range);
  }
  return ws;
}

function sheetToArrayOfArray(ws) {
  // include 3rd party libs only when they are needed
  const XLSX = require ('xlsx');

  if(!ws || !ws['!ref']) {
    return [];
  }
  let arrayOfArray = [];
  let range = XLSX.utils.decode_range(ws['!ref']);
  for(let R = range.s.r; R <= range.e.r; ++R) {
    let array = [];
    arrayOfArray.push(array);
    for(let C = range.s.c; C <= range.e.c; ++C) {
      let cell_ref = XLSX.utils.encode_cell({c: C, r: R});
      let cell = ws[cell_ref];
      array.push(cell.v);
    }
  }
  return arrayOfArray;
}

function Workbook() {
  if (!(this instanceof Workbook)) {
    return new Workbook();
  }
  this.SheetNames = [];
  this.Sheets = {};
}

exports.toExcel = (sheets, filePath) => {
  // include 3rd party libs only when they are needed
  const XLSX = require ('xlsx');

  let wb = new Workbook();
  for (let sheet of sheets) {
    let data = sheet.data;
    let ws = sheetFromArrayOfArrays(data);
    wb.SheetNames.push(sheet.name);
    wb.Sheets[sheet.name] = ws;
  }
  XLSX.writeFile(wb, filePath);
};

exports.fromExcel = filePath => {
  // include 3rd party libs only when they are needed
  const XLSX = require ('xlsx');

  let wb = XLSX.readFile(filePath);
  let sheets = [];
  for (let name of wb.SheetNames) {
    let data = sheetToArrayOfArray(wb.Sheets[name]);
    sheets.push({name: name, data: data});
  }
  return sheets;
};