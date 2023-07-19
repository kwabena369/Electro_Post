const express = require('express');
const ejslayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser")
const {expressjwt} = require("express-jwt");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
 
const app =  express();
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
// Set view engine and layouts
app.set('view engine', 'ejs');
app.set("views" , __dirname + "/views");
app.set("layout","layouts/layout");
app.use(ejslayout);

app.use(express.static("public"))
 const fs = require("fs")


 
 const UserIdentity = require('./model/UserIdentity');
 const com_db  = require("./model/comment_db")
 const allthem  = require("./model/Project-User");
 const jwt = require("jsonwebtoken");

//  router for the other
 const NotificationRouter  = require("./Routers/Notification_");
  app.use("/n",NotificationRouter);
 // for setting of the count
 let {get_Number} = require("./util-staff/Send_Normal_app_notici")

  


//  here is the router for the commenting of thing


  const filedirectory  = "public/userProfile/";

//  here is for the socket side of the application 
const http = require("http");
 const server = http.createServer(app);
 const {Server} = require("socket.io")
  const cors = require("cors");
   app.use(cors())
  
    
    
   const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });
  io.on("connection",(socket)=>{

    
    // for the realaction of the vote
     socket.on("vote_here",(data)=>{
       socket.emit("vote_from_above",data);
       
     })


    // for the like
 socket.on("new_like_value", (data)=>{
    //  here is whne there is a new like thing 
     io.emit("someone_liked",data);
  
 })

  // for the comment-- this is for the prottotype section
    socket.on("comment_here",(data)=>{ 
      //   for one comment ---sending
       io.emit(`${data.proto_id}now`,data);
        //  then updating the section of the number of comment 
        io.emit(`Another_Comment_number`,data.proto_id);
console.log("some one did")
        //   here when we get the hit that there is a comment is the other place 
        //  then we are going to be sending a command to the other side 
        //  to do what to  update the value of any thing which is at this point
        //   of the application 
         
      
      })
      //  for the fault thing
       socket.on("comment_here_2",(data)=>{ 
        //   for one comment ---sending
         io.emit(`${data.fault_id}now`,data);
          //  then updating the section of the number of comment 
          io.emit(`Another_Comment_number_2`,data.fault_id);
        })
  })

  
  module.exports  = io;
// All routers  and setting thier use thing
const UserRouter = require("./Routers/Users");
app.use("/user",UserRouter);
//  for the commenting
const comment_Router = require("./Routers/user-PrototypeStaff.js/chat_Router");
// for the middleware

  //  for the prototype
   const PrototypeRouter = require("./Routers/user-PrototypeStaff.js/prototypeStaff");
  //   here the authen is neeed
  app.use("/prototype",PrototypeRouter);
   app.use("/comment_now",comment_Router);
   

   const multer = require('multer');
const path = require('path');

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/GhostWinter");
const donedb  = mongoose.connection;
donedb.on("error",()=>{
  console.log("Could not Connect")
});

donedb.on("open",()=>{
  console.log("Database Connected ")
});
                                                                                                                         
//  creating the middleware
//   for the authentication
async function requireAuth(req, res, next) {
  const prototypes = await allthem.find().populate("currentUser");
  const userToken = req.cookies.UserToken;
 
  let array_tags = [
    "Aerospace",
    "Electrical_En",
    "Computer_Engineering",
    "Rasperypi",
    "Marineenginnerring",
    "Thinkerkit",
    "Arduino",
    "Arduino",
    "Arduino"
   ]
  //   here is the setting of the vlaue 
    res.locals.tags =array_tags

  if (req.url.match(/^\/[^/]+\/p$/) ||
   req.url.match(/^\/[^/]+\/q$/)) {
    next();
    return;
  }

  if (!userToken) {
    res.locals.logIn_SignIn = false;
    res.render("LandingPage.ejs", { prototypes });
    return;
  }

  try {
    let Goldenlock = jwt.verify(userToken, "pickthecup");
    req.auth_id = Goldenlock._id;
    req.user_now = await UserIdentity.findOne({ _id: req.auth_id });

    //  we do find the user really there 
     if(req.user_now){
    res.locals.logIn_SignIn = true;
     }
    try {
      let value = await get_Number(req.user_now);
      res.locals.Number_Notification = value;
    } catch {
      res.status(400).send("something not good");
      return;
    }

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.redirect("/user/logIn");
    } else {
      res.status(400).send("token is corrupted");
    }
  }
}

app.use(requireAuth);
// for the Question Router
const QuestionRouter = require("./Routers/Question");
 app.use("/question",QuestionRouter)
 const settingRouter = require("./Routers/SettingRouter");
 app.use("/setting/u",settingRouter);
//  for the othere
 const snippet_router = require("./Routers/user-PrototypeStaff.js/snippet_chat.js");
app.use("/snippet_chat",snippet_router);
  


   const storageProfile = new multer.diskStorage({
     destination : (req,file,cb)=>{
       cb(null,path.join(__dirname,"public/userProfile"))
     },
      filename  : (req,file,cb)=>{
        let filename  = req.params.userid+"."+file.mimetype.split("/")[1];
        fs.readdir(`${filedirectory}`,(err,files)=>{
            if(err)throw err
               
            
                
              if(files.length !== 0){  
  
                files.forEach((file)=>{
                  //  console.log("file")
                  //  console.log(file);
                     if(file.startsWith(`${req.params.userid}`)){
                           fs.unlinkSync(`${filedirectory}${file}`,(err)=>{
                               if(err)throw err
                                 console.log("it was deleted");
                               
                           })
                      cb(null,filename)
                     }else{
                      cb(null,filename)
                     }
                })
   
             }else{
              cb(null,filename)
             }
           
         }
        
        )


       
      }
   })
    const uploaded  = multer({storage : storageProfile});
 
 
    app.post("/userProfile/:userid",
    uploaded.single("user-Profile"),
    async(req,res)=>{
//  here the url of the person is been going to be display in the app
 const useridNow  = req.params.userid;
   const userHere   = await UserIdentity.findOne({_id : useridNow});
      userHere.userProfile = req.file.filename
       userHere.save();
    res.send(" the profile changed")

 })

//  here should be the first stage where the person login
app.get('/',requireAuth,async(req,res) => {
  // here 
   
  const prototypes = await allthem.find().populate("currentUser")
const user = await UserIdentity.findOne({_id : req.auth_id});
console.log(user)
res.render("LandingPage.ejs",{user,prototypes});
})



//  here right here is the router which is
//  going to be responding  to the userProfile
 
 app.get("userprofile/:userid",requireAuth,async(req,res)=>{
         let realuser =  await UserIdentity.findOne({_id : req.params.userid.split(".")[0]})
           
          if(realuser){
            res.sendFile(req.params.userid, { root: 'public/userProfile' });
          }
          
 })
  
  
// this is for the serving of the imge of the imterest
 app.get("interest/pic/:pic_name",async(req,res)=>{
  res.sendFile(req.params.pic_name, { root: 'public/zone_pic' });
 }) 
  

//   for the googleuse
 const goolgleauthe  = require("./Routers/AuthenGoogle"); 
 app.use("/auth",goolgleauthe);
  // for the aauthentication 
//  app.use(requireAuth);
 



  // that we are going to handle anything which is googleauthe

// for the prototype preview
  app.get("/:fileurl/p",requireAuth,(req,res)=>{
    const fileurl = req.params.fileurl
    //  console.log(fileurl)
      res.sendFile(fileurl, { root: 'public/pp' });
      // console.log(fileurl)
  })
  // for the Question preview
  app.get("/:fileurl/q",requireAuth,(req,res)=>{
    const fileurl = req.params.fileurl
      res.sendFile(fileurl, { root: 'public/fault_pp' });
  })

  app.get("/:fileurl/chat_image",requireAuth,(req,res)=>{
    const fileurl = req.params.fileurl
      res.sendFile(fileurl, {root: 'public/chat_image'});
  })   

  app.get("/post_some",requireAuth,async(req,res)=>{
    let realuser =  await UserIdentity.findOne({_id : req.auth_id})

    try{
     res.render("./Hope_nugget/no_thing_dosomething.ejs",{user : realuser});
    }catch(err){
      console.log(err);
  console.log("ghost ware..")
    }
 })



   

   let {profile_Authen} = require("./utilfunction/user_view")
   
  // for the education the person has 
   let education = require("./model/Education")
  // for the did what
   let didwhat  = require("./model/Did_what");
const Employment_db = require('./model/Employment_db');

 
  app.get("/:handle_name",profile_Authen,async(req,res)=>{
    let user_ = 
    await UserIdentity.
    findOne({Userhandle : req.params.handle_name}) ;
        
      
      if(user_){ 
 // find all the education under here

 let educationNow = await education.find({ currentUser:{ $in: user_ } })
  // aquaring all the employmwnt info
  let employment = await Employment_db.find({currentUser  : user_})

   console.log(employment);
//  creating new array of edu _ thing_did
try {
     educationNow = await Promise.all( educationNow.map( async(element)=>{
      let didwhat_now =
      await didwhat.find({ Place_did_it: element})
       return {
        Sch_Name : element.Sch_Name,
      //  for the thing did
      thing_did :didwhat_now
       }
     })
     )
} catch (error) {
  console.log(error)
}
    // console.log(educationNow[0].Sch_Name)
 const prototypes = await allthem.find({ currentUser:{ $in: user_ } });
          
 let  user  = await UserIdentity.findOne({_id : req.auth_id });
  let bol ;
  
         if(req.auth_id === user_._id.toString()){
           bol  = "true"
        res.render("./Electro-Post/User_Own/user_Rep.ejs",
       {user,bol,user_,prototypes,educationNow,employment})
  
      }else{ 
        res.render("./Electro-Post/User_Own/user_Rep.ejs",
      {user,bol,user_,prototypes,educationNow,employment})
         }
}
    })
      //  for the router for the nothing but do something page

         





    //   middleware for the
 function deal_with_it(err,req,res,next){
  if(err instanceof multer.MulterError){
 res.redirect(`/prototype/new/?massage=${"file is not accepted"}`)
console.log(err);
  return
 }else if(err){
   res.status(500).send("there was a bad erro")
   console.log(err);
 }
  next();
   
 }





 app.use(deal_with_it);




   module.exports = {
     authen   : requireAuth
    }



     
     



 
server.listen(3000, () => {
  console.log("Working in the back bro")
})
