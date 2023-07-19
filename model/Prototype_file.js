const mongoose  =  require("mongoose");
 
//  this is for a file uploading 
 const prototype_file_Schema  = new mongoose.Schema({
      protype_Id : {
        type :  mongoose.SchemaTypes.ObjectId,
        required : true ,
         ref  : "protypeInfo"
      },
       
     file_name : {
     type  : String,
      required : true
 },

//   this for the user who didupload the file
 currentUser:{
          type :  mongoose.SchemaTypes.ObjectId,
           required : true ,
            ref  : "UserIdentity"
     }
     ,
    Number_download :{
             type : Number,
               default : 0
    }
    
     
 })

//  Making it avaliable
 module.exports = mongoose.model("protype_file",prototype_file_Schema)