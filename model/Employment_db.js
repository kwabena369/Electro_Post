const mongoose  =  require("mongoose");
 
//  creating of the schemma for the posted project or prototype
 
 const Employementschema  = new mongoose.Schema({
      Name_Position : {
          type : String,
          required :true 
      },
       From:{
          type : Number,
          required : true
       },
       To:{
        type : Number,
        required : true
     },
      dateCreated :{
          type  : Date,
           default : Date.now()
      },
     currentUser:{
          type :  mongoose.SchemaTypes.ObjectId,
           required : true ,
            ref  : "UserIdentity"
     }
    

 })

//  Making it avaliable
 module.exports = mongoose.model("Employmentschema",Employementschema)