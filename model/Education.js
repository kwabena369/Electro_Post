const mongoose  =  require("mongoose");
 
//  creating of the schemma for the posted project or prototype
 
 const EducationSchema  = new mongoose.Schema({
      Sch_Name : {
          type : String,
          required :true 
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
 module.exports = mongoose.model("Educationinfo",EducationSchema)