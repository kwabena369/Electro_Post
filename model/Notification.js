const mongoose  =  require("mongoose");
 
//  creating of the schemma for the posted project or prototype
 
 const  NotificationSchema  = new mongoose.Schema({
      Of_Kind: {
          type : String,
          required :true 
      },
      dateCreated :{
          type  : Date,
           default : Date.now()
      },
      Associated:{
        type :  [mongoose.SchemaTypes.ObjectId],
         required : true ,
          ref  :"protypeInfo"
   },
   
  Status : { 
      type  : String,
       default :"N_C"
  }
,
     currentUser:{
          type :  mongoose.SchemaTypes.ObjectId,
           required : true ,
            ref  : "UserIdentity"
     }
    

 })

//  Making it avaliable
 module.exports = mongoose.model("NotificationDB",NotificationSchema)