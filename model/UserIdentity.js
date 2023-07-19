
const mongoose = require("mongoose");

const UserSchema  =  new mongoose.Schema({
     Userhandle: {
        type: String,
        required: false,
         default:"",
        trim: true,
      },
       First_Name:{
        type: String,
        required: false,
        trim: true,
      },
      Last_Name:{
        type: String,
        required: false,
        trim: true,
      },
      Email: {
        type: String,
        required: true,
        trim: true,
      },
      Password: {
        type: String,
        required: false,
        // minlength: 8,
        trim: true,
      },
       userProfile:{
         type :String,
         default:""
       },
        Number_Connectors : {
           type : Number,
           default :0

        }
       ,
        Id_connectord : [{type:mongoose.SchemaTypes.ObjectId,ref:"UserIdentity"}]
        ,
        verificationToken:{
            type : Number,
            required :false,
              default:""
        },
         verifiedUser : {
              type:Boolean,
               default : false
         }
         
        ,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }

      //   user's using the google authe thing 
       ,
       GoogleUserID : { 
         type : String,
          required : false
       },
        //  for the status of the notification section
         getEmail_falut : {
           type : String,
           default : 'Yes'
         },
         getEmail_comment : {
          type : String,
          default : 'Yes'
        },
          getPrototype_alert : {
          type : String,
          default : 'Yes'
        },
          //  here is the array of the interest of the user
           interest_array : { 
             type: Array,
               default : "others"
           }
})
//  here we seek to hash the password

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('Password')) {
      user.Password = await bcrypt.hash(user.Password, 4);
    }
    next();
  });

module.exports = mongoose.model("UserIdentity",UserSchema);
                                          