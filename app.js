const express = require("express");
const app = express();

var cors = require('cors')
app.use(cors());

require("dotenv").config({ path: ".env" });

const fs = require("fs");
var path=require('path');

const { promisify } = require("util");
const fileInfo = promisify(fs.stat);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')));

let video1 = "./public/video.mp4"




app.get("/", (req, res) => {
  res.render("index");
});


app.get("/video", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "video/mp4",
  });
  fs.createReadStream(video1).pipe(res);
});


app.get("/stream-video", async (req, res) => {
  const { size } = await fileInfo(video1);
  const renege = req.headers.range;


  if (renege != undefined) {
    let [start, end] = renege.replace(/bytes=/, "").split("-");
    start = parseInt(start);
    end = end ? parseInt(end, 10) : size - 1;
    let cn_len = Math.abs( (start - end) + 1)

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Range": `bytes`,
      "Content-Length": cn_len,
      "Content-Type": "video/mp4",
    });

    console.log( "start : " +  start) ;
    console.log( "end : " +  end) ;
    console.log( "Content-Length : " +  cn_len) ;


    fs.createReadStream(video1, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "Contain-Length": size,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(video1).pipe(res);
  }
});


module.exports = app;
