const multer  = require("multer");
 const path = require("path");
const { imagefilter } = require("./filters");


 const storage =  multer.diskStorage({
    destination  : (req,file,cb)=>{
                  //  wheather for fault or other thing
                   if(file.fieldname === "fault_files"){
                     cb(null, path.join('./public/fault_pp/'));
                   }else{
                     cb(null, path.join('./public/pp/'));
                   }
   },
     filename : (req,file,cb)=>{
        cb(null,"-"+req.body.prototypeName 
         +req.auth_id+"-"+Date.now()+file.originalname);

}
 })
  
//   for the uplaoder 
 let uploader = multer({storage:storage ,
    fileFilter:function(req,file,cb){
          imagefilter(req,file,cb);
    }})

 module.exports = uploader