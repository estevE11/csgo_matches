const express = require("express");
const _app = express();
const fs = require("fs");
const mongoose = require("mongoose");
const { app, BrowserWindow } = require('electron')
const { GoogleSpreadsheet } = require("google-spreadsheet");

const colors = require("./colors");
const matchSaver = require("./match");
const sheetManager = require("./sheetManager");

_app.use(express.urlencoded({extended: false}));

const client_secret = "./client_secret.json";
const sheetID = "16faNKAJ2ot-PIdyu_6as6LQ31fRoxnn_8fk4txK8goE";

mongoose.connect("mongodb://localhost/csgomatches", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

_app.listen(8080, () => {
    console.log("Listening to 8080");
});

_app.post("/match", (req, res) => {
    const match = {
        id: req.body.id,
        players: req.body["players[]"],
        map: req.body.map,
        result: Number.parseInt(req.body.result),
        date: req.body.date
    };
    console.log(match);
    sheetManager.addMatch(match);
    res.send("Match reveived!");
});

const createWindow = () => {
  let win = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      nodeIntegration: false
    }
  })

  win.loadFile('./public/index.html')
  win.webContents.openDevTools()
}

const main = async () => {
    const doc = new GoogleSpreadsheet(sheetID);

    // OR load directly from json file if not in secure environment
    await doc.useServiceAccountAuth(require(client_secret));
    
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);
    
    const sheet = doc.sheetsByIndex[0];
    sheetManager.sheet = sheet;

    await sheetManager.loadDatabaseFromScratch();
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

main();
app.whenReady().then(createWindow);
