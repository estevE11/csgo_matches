const colors = require("./colors");
const matchSchema = require("./match");

const results_strings = ["Derrota", "Empate", "Victoria"];
const results_id = [];
results_id["Derrota"] = -1;
results_id["Empate"] = 0;
results_id["Victoria"] = 1;

exports.sheet = null;

exports.addMatch = async (match) => {
    if(match.id == null || match.id == "") {
        match.id = await this.getMatchCount(this.sheet);
    }
    let col = match.id+1;
    await this.sheet.loadCells({
        startRowIndex: 0, endRowIndex: 8, startColumnIndex:col-1, endColumnIndex: col+1
    });

    //Result
    console.log(results_strings);
    let cell = this.sheet.getCell(0, col);
    cell.value = results_strings[match.result+1];
    //cell.backgroundColor = colors[""+match.result];

    //Players
    for(row = 0; row < 5; row++) {
        let cell = this.sheet.getCell(row+1, col);
        cell.value = match.players[row];
        cell.backgroundColor = colors[match.players[row]];
    }

    //Map
    this.sheet.getCell(6, col).value = match.map;

    //Date
    this.sheet.getCell(7, col).value = match.date;
    
    await this.sheet.saveUpdatedCells();
    
    this.setMatchCount(match.id+1);
    match.date = getDate(match.date);
    //matchSchema.create(match);
}

exports.loadMatch = (id) => {
    let col = id+1;
    let match = {
        id: id,
        players: ["", "", "", "", ""],
        result: 0,
        map: "",
        date: null
    };

    for(row = 0; row < 5; row++) {
        let val = this.sheet.getCell(row+1, col).value;
        if(val == null) val = "";
        match.players[row] = val;
    }

    match.result = results_id[this.sheet.getCell(0, col).value];
    match.map = this.sheet.getCell(6, col).value;
    match.date = getDate(this.sheet.getCell(7, col)._rawData.formattedValue);

    return match;
}

exports.loadDatabaseFromScratch = async () => {
    const match_count = await this.getMatchCount();
    console.log(match_count);
    await this.sheet.loadCells({
        startRowIndex: 0, endRowIndex: 8, startColumnIndex:0, endColumnIndex: match_count+1
    });
    
    for(i = 0; i < match_count; i++) {
        const match = this.loadMatch(i);
        matchSchema.create(match);
    }
}

exports.getMatchCount = async () => {
    await this.sheet.loadCells("B8:D10");
    return this.sheet.getCellByA1('C9').value;
}

exports.setMatchCount = async (n) => {
    await this.sheet.loadCells("B8:D10");
    let cell = this.sheet.getCellByA1('C9');
    cell.value = n;
    await this.sheet.saveUpdatedCells();
}

const getDate = (date_string) => {
    const d = date_string.split("/");
    let date = new Date();
    date.setDate(d[0]);
    date.setMonth(d[1]);
    date.setFullYear(Number.parseInt(d[2])+2000);
    return date;
}

const dateToString = (date) => {
    const d = date.getDate();
    const m = date.getMonth();
    const y = (Number.parseInt(date.getFullYear())-2000);
    return (d > 9 ? d : "0" + d) + "/" + (m > 9 ? m : "0" + m) + "/" + (y > 9 ? y : "0" + y);
}