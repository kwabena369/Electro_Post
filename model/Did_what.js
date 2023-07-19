const mongoose  =  require("mongoose");
 
//  creating of the schemma for the posted project or prototype
 
 const Did_Schema  = new mongoose.Schema({
      Name : {
          type : String,
          required :true ,
           trim : true
      },
      dateCreated :{
          type  : Date,
           default : Date.now()
      },
     Place_did_it:{
          type :  mongoose.SchemaTypes.ObjectId,
           required : true ,
            ref  : "Educationinfo"
     }
    

 })

//  Making it avaliable
 module.exports = mongoose.model("Did_what_info",Did_Schema)