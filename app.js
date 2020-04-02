const fs = require("fs");
const mongoose = require("mongoose");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const matchSaver = require("./match");

const client_secret = "./client_secret.json";
const sheetID = "16faNKAJ2ot-PIdyu_6as6LQ31fRoxnn_8fk4txK8goE";

mongoose.connect("mongodb://localhost/csgomatches", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const main = async () => {
    const doc = new GoogleSpreadsheet(sheetID);

    // OR load directly from json file if not in secure environment
    await doc.useServiceAccountAuth(require(client_secret));
    
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);
    
    const sheet = doc.sheetsByIndex[0];

    await loadDatabaseFromScratch(sheet);
}

const loadDatabaseFromScratch = async (sheet) => {
    await sheet.loadCells("A1:H1");
    let match_count = sheet.getCellByA1('H1').value;
    console.log(match_count);
    await sheet.loadCells("A1:F" + (match_count+2));
    
    for(i = 0; i < match_count; i++) {
        const match = loadMatch(sheet, i);
        matchSaver.create(match);
    }
}

const loadMatch = (sheet, id) => {
    let row = id+1;
    let match = {
        id: id,
        players: ["", "", "", "", ""],
        date: null
    };

    for(col = 0; col < 5; col++) {
        let val = sheet.getCell(row, col).value;
        if(val == null) val = "";
        match.players[col] = val;
    }

    match.date = getDate(sheet.getCell(row, 5)._rawData.formattedValue);

    return match;
}

const getDate = (date_string) => {
    const d = date_string.split("/");
    let date = new Date();
    date.setDate(d[0]);
    date.setMonth(d[1]);
    date.setFullYear(Number.parseInt(d[2])+2000);
    return date;
}

main();
