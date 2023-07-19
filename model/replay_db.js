  const mongoose = require("mongoose")
  //   here is the schema for the reply
 const ReplyScehma = new mongoose.Schema({
    // for the content
     content : {
       type :  String,
       required : true
     },
      // for the pssecific comemet
       _kind_of_mother:{
         type:mongoose.SchemaTypes.ObjectId,
          ref: "comment_db"
       }
        
   })


   module.exports = mongoose.model("reply_db",ReplyScehma);