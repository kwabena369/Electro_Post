const mongoose  = require("mongoose");


 let snippet_chat_schema  = new mongoose.Schema({
     content:{ 
      type : String,
      required :true
     },
    //    the info about the specific chat 
     where_X : {
          type  :String,
          required : true
     },
      where_Y : {
         type : String,
          required : true
      },
    //    the user and prototype info
     Specific_Fault_Proto:{
        type : mongoose.SchemaTypes.ObjectId,
         ref : "protypeInfo"
     }
     ,
     User_Commentor:{
        type : mongoose.SchemaTypes.ObjectId,
         ref : "UserIdentity"
     },
    //    for which of the image did we click
    of_kind : {
          type : String,
          default : "file_1"
    }
 })

//   making it available to the world of ghost
module.exports = mongoose.model("snippet_chat_db",snippet_chat_schema)