const express = require("express");
const Musiclistrouter = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer")
const musiclist = fs.readdirSync("./public/Goat");
    

//  Uplaoding using the multer pack
  const storage =multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/Goat'));
    },
    filename: function (req, file, cb) {
      cb(null,Date.now()+"-" +file.originalname );
    }  
  })
//  creating of the upload
    const GreatUploader =  multer({storage : storage});

// mordification of the array element and giving each one of them
//  name and the url for how they would be acessed
const NowMusic = musiclist.map(file => {
    return {
        name: path.parse(file).name,
        url: `/music/play?file=${encodeURIComponent(file)}`
    }
});
// for directing the thing to load all static file from this folder
Musiclistrouter.use(express.static("public"))
//  here is the router for  the uploading of the music
 Musiclistrouter.post("/rec/up",GreatUploader.single("audio"),(req,res)=>{
  //   note audio is the name of the name of the tag
    res.send(" this audio recording is been uploaded")
 })
// where you are going to see all the image
Musiclistrouter.get("/", (req, res) => {
    res.render("./component/musiclist", { NowMusic })
});
//  for visiting the play of the song
Musiclistrouter.get("/play", async (req, res) => {
    const filename = req.query.file;
    const pathMusic = filename;
 res.render("./component/AudioPlace",{pathMusic})

});

// for recoding 
 Musiclistrouter.get("/rec",(req,res)=>{
     res.render("./component/RecordingStation");
 })

// for geting the music file
Musiclistrouter.get("/:fileurl/sound",(req,res)=>{
      const fileurl = req.params.fileurl
 
        res.sendFile(fileurl, { root: 'public/Goat' });
        console.log(fileurl)
})
module.exports = Musiclistrouter;
