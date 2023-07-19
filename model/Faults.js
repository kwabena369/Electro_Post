const mongoose  =  require("mongoose");
 
//  creating of the schemma for the posted project or prototype
 
 const falut_Schema  = new mongoose.Schema({
    
      dateCreated :{
          type  : Date,
           default : Date.now()
      },
//  here is for the user discription of what is going to be done
     discribe_falut : {
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
    
     //    for the number
Up_Count:  { 
      type : Number,
      default :  0
},

 Up_promoter: [ 
         { type: mongoose.SchemaTypes.ObjectId,
         ref: 'UserIdentity' }
             ],
 // for the number of down   
 down_Count:  { 
     type : Number,
     default :  0
},
down_promoter: [ 
        { type: mongoose.SchemaTypes.ObjectId,
        ref: 'UserIdentity' }
            ],

  Views : { 
     type : Number,
     default : 0
  },
   _Number_Comment : { 
     type : Number,
     default : 0
   },
    ofKing:{
      type: String,
       default: "text"
    },
    
    _tag_array :{
     type :Array,
     required : false,
     default : ['Electronic']
 },
 _Number_View : { 
     type : Number,
     default : 0
   },
   _arraypp_file : {
      type :Array,
      defult : null 
   }
   ,
   //  the array of the viewer of the thing
   _Specific_Viewer: [
     { type: mongoose.SchemaTypes.ObjectId,
       ref: 'UserIdentity' } ],
 })

//  Making it avaliable
 module.exports = mongoose.model("falut_Schema",falut_Schema)