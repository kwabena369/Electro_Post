const mongoose  =  require("mongoose");
 
//  creating of the schemma for the posted project or prototype
 
 const prototypeSchema  = new mongoose.Schema({
      protypeName : {
          type : String,
          required :true 
      },
      dateCreated :{
          type  : Date,
           default : Date.now()
      },
//  here is for the user discription of what is going to be done
     discribePrototype : {
     type  : String,
      required : true
 },
    //  here is for the current user who created the thing 
     currentUser:{
          type :  mongoose.SchemaTypes.ObjectId,
           required : true ,
            ref  : "UserIdentity"
     }
     //  here is for the image of the of the prototype
     ,pp:{
           type : String,
      required : false            
      },
        _arraypp :{
           type :Array,
           required : false
       },
     //    this keep the number of like
          Number_likes  : {
             type : Number,
               default : 0
              },
 likes: [ { type: mongoose.SchemaTypes.ObjectId, ref: 'UserIdentity' } ],
    
     // for the files
       _arraypp_file :{
           type : Array,
            default : []
       }
       ,Number_download_file :{
          type : Number,
            default : 0
                       },
  Views : { 
     type : Number,
     default : 0
  },
   _Number_Comment : { 
     type : Number,
     default : 0
   },
    // representing the number of time 
     Number_time : {
        type : Number,
         default :0
     },
   Comment_checked_Notifi : {
        type  :Boolean,
         default : true
   },
//  here is going to be the
//  numbere of view of the thing 
_Number_View : { 
  type : Number,
  default : 0
},
//  the array of the viewer of the thing
_Specific_Viewer: [
  { type: mongoose.SchemaTypes.ObjectId,
    ref: 'UserIdentity' } ],
     
    _tag_array :{
      type :Array,
      required : false,
      default : ['Electronic']
  },
  })
//  Making it avaliable
 module.exports = mongoose.model("protypeInfo",prototypeSchema)