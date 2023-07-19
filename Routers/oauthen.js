const express = require('express'); 
   const session = require("express-session");
    const passport = require("passport");
     
     
     const oauthenRouter =express();
      oauthenRouter.use(express.static("public"));
    //  here we are going to be setting up the ssion 
      oauthenRouter.use(session({
           resave : false ,
            saveUninitialized : true,
             secret : "SECRET"
      }))

    //    a const
var userProfile
       
     

    //    here is for the  passport thing
       
    oauthenRouter.use(passport.initialize()); 
     oauthenRouter.use(passport.session())
    
  passport.serializeUser(function(user,cb){
      cb(null,user)    // for the saving of the userinformation
  })
   
//  for the getting od the user information 
  passport.deserializeUser(function(user,cb){
     cb(null,user);
  })
   


//    here is for the google authen parr
 const GoogleOauthen  = require("passport-google-oauth").OAuth2Strategy;
  
//   and in here there was a mysterious function which had something like the 
//    function for the  collecting of the user client secret and  other informations 
 
   const client_secret  = "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";
    // for the client id
 const client_ID  = "499424974257-8fns3gu3opui5mnoe1ig91q5vjpj973c.apps.googleusercontent.com"

 passport.use(new GoogleOauthen({
      clientID :client_ID,
       clientSecret : client_secret,
       callbackURL: "http://localhost:3000/auth/google/callback"
    },function(accessToken,refreshToken,profile,done){
          userProfile = profile;
             return done(null,userProfile)
 }))

//   here is the router for the  authen thing 
 
 oauthenRouter.get("/checkme",
 passport.authenticate("google",{scope : ["profile","email"]})); 
   
//   here is the point where the authen is done 
 oauthenRouter.get("/google/callback",
 passport.authenticate("google",{failureRedirect : "/auth"}),
  (req,res)=>{
    //    res.render("./Electro-Post/DoneAuth.ejs",{user : req.user});
      res.send(req.user.displayName);
  })


  oauthenRouter.get("/",(req,res)=>{
      res.render("./Electro-Post/Oauthenticate.ejs")
  })


   
  // module.exports = oauthenRouter