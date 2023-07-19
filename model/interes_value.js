const mongoose  =  require("mongoose");
 
//  creating of the schemma for the posted project or prototype
 
 const  InterestSchema  = new mongoose.Schema({
      Intest_Name : {
          type : String,
          required :true 
      },
      dateCreated :{
          type  : Date,
           default : Date.now()
      },
      level_intensity : { 
          type : Number,
          default : 0
      },
     currentUser:{
          type :  mongoose.SchemaTypes.ObjectId,
           required : true ,
            ref  : "UserIdentity"
     }
    

 })

//  Making it avaliable
 module.exports = mongoose.model("InterestDB",InterestSchema)