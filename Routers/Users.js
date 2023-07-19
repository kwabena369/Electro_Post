const express = require("express");
const bodyParser = require("body-parser");
const UserRouter = express.Router();
const cokieParser = require("cookie-parser");
UserRouter.use(express.static("public"))
UserRouter.use(cokieParser())
 const bcrypt = require("bcryptjs");
 const nodemailer = require("nodemailer")
  const jwt  = require("jsonwebtoken");
  //  const {authen}= require("../server")




// for the io 
const io = require("../server")

     const {genToken,verifyToken} = require("../utilfunction/tokenurl")

     // const key = generateKey();
//  creating of the transporter 
  const Transportor = nodemailer.createTransport({
      service: 'gmail',
         host: 'smtp.gmail.com',
         port: 465,
             secure :true,
             auth:{
                user :"boampongbismarck079@gmail.com",
                pass : "zchjoleucidsxlns"
               }
  })




//  Gerating of the token for the user
 
  



  // here is some utility function 
 function generateToken(user) {
     const token = jwt.sign({ _id: user._id }, 'pickthecup',{expiresIn:"5d"});
     return token;
   } 
//   DataBases
  const  UserIdentity = require("../model/UserIdentity");
const {authenPerson} = require("../util-staff/authenUser");
const { profile_Authen } = require("../utilfunction/user_view");
  
//  FOR SignUp
UserRouter.get("/signUp",(req,res)=>{
     res.render("Electro-Post/SignUp.ejs");
})
//  FOR LogIn
 UserRouter.get("/logIn",(req,res)=>{
      res.render("Electro-Post/login.ejs");
 })


 UserRouter.get("/gen_handle",(req,res)=>{
  //  sending the staff
   let fname = req.query.fname;
   let lname = req.query.lname;
    const {gen_handle}  = require("../utilfunction/handleGen")
    if(res.json({handles  :  gen_handle(fname,lname)})){
        console.log("done");
    }else{
       res.status(400).send("it did not work")
    }
    
 })

  

//  For Signing Up
 UserRouter.post("/signUp",async(req,res)=>{
     const crypto = require("crypto")
     const  fourByte = crypto.randomBytes(4);
     const userToken = fourByte.readInt32BE()%10000000;
      console.log("see this is the number");
      //  console.log(userToken)
     const exitsthere =  await UserIdentity.findOne({Email: req.body.emailContent})
    const userhandle =  await UserIdentity.findOne({Userhandle : req.body.handle});
     if(exitsthere || userhandle){
       res.status(400).send("Email is in the system")
  }
 
     try {
      const NewUserIdentity  =  new UserIdentity({
           First_Name  :req.body.fname,
           Last_Name :req.body.lname,
           Userhandle : req.body.handle,
            Email :req.body.emailContent,
            Password :  req.body.Password,
            verificationToken : userToken
          
      })
       let outNow =  await NewUserIdentity.save();
         if(outNow){ 
          let NowTo =  generateToken(outNow);
          res.cookie("UserToken",NowTo,{ httpOnly: true, 
             maxAge: 7 * 24 * 60 * 60 * 1000 })
             .redirect("/setting/u/set_interest")
      
          //   here we are going to be doing the sending of the mail
            const mailOption = {
                  from : "bampongbismarck079@gmail.com",
                  to : outNow.Email,
                   subject: "Verification Of Account",
                    // so here is going to be the url 
                    text  :
                     `http://localhost:3000/user/verification?token=${outNow.verificationToken}`
            }
             
          //    here we doing the sending 
             Transportor.sendMail(mailOption,(err,done)=>{
                if(err){
                     console.log(err);
                      
                }else{
                     console.log("email is delivered")
                }
             });
       console.log(outNow)
           
      }else{
         res.redirect('/');
         console.log("token staff could not work");
         }
           } catch (error) {
               console.log(error)
                res.status(500).send("sometime Bad happend so no saving");
  }
     })
// For Logining In
UserRouter.post("/logIn",async(req,res)=>{
      const  email = req.body.emailContent
      const  Password = req.body.Password
 try {
     const outcomeofS = await UserIdentity.findOne({Email : email})
       if(outcomeofS){
  
          //  here is for the checking of the password
           const userHashPW = outcomeofS.Password;
            
 bcrypt.compare(Password,userHashPW,(err,outcome)=>{
       if(outcome){
          const NowToken =  generateToken(outcomeofS);
          res.cookie("UserToken",NowToken,{ httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }).redirect("/")
       }else{
          //  we are going to be serving the 
          res.render("Electro-Post/login.ejs",{news : "Password incorrect"});

       }
 })             

       
     }else{
           res.send("not a user")
       }
// here for the login session token 
 
 } catch (error) {
      res.send("this man not a  user..")
 }
})

// for email editing
UserRouter.get("/edit_email",async(req,res)=>{
      try{
const userNow = await UserIdentity.findOne({_id : req.params.user_id})
           res.render("./component/Edit",{user : userNow})
      }catch{
           res.send("it is not happening bro")
      }
})

 
 
 
UserRouter.post("/:user_id/edit", async(req,res)=>{
     //  here  the person do the real edit 
     try{
          const userNow  =  
          await UserIdentity.findOneAndUpdate({_id : req.params.user_id},{StageName : req.body.StageName})
          // await userNow.save()
       res.send("this name was change goody")
     }catch{
           res.send("could not do the change")
     }
})



  

//   for the verification Route
 
  UserRouter.get("/verification",async(req,res)=>{

     //  getting the token from the url 
      const userNowToken = req.query.token;
          let useHere  = await UserIdentity.findOne({verificationToken : userNowToken});
           
           if(useHere){
          useHere.verifiedUser = true; 
           await useHere.save()
               res.render("Electro-Post/verification.ejs",{user : useHere}) 
               //   here we are going to be setting the verifi  
           }else{
                res.send(400).send("stoping doing the things")
           }
  })
 

 

//  here is for the useremailcheking
UserRouter.get("/check-email",async(req,res)=>{
  const emailvalue = req.query.email
   const inther =  await UserIdentity.findOne({Email: emailvalue})

    if(inther){  
       res.json({isthere :true})
     }else{
      res.json({isthere :false})
 }
})


 
   UserRouter.get("/forget",(req,res)=>{
//    page for the person to enter the email
        res.render("Electro-Post/forget.ejs")
      })
   
      UserRouter.post("/forget", async (req, res) => {
          let emailContent = req.body.emailContent;
        
          let user = await UserIdentity.findOne({ Email: emailContent });
        
          if (user) {

            const token = genToken();
            const recoveryURL =
             `http://localhost:3000/user/recovery?userid=${user._id}&token=${token}`;
        
            const mailOption = {
              from: "bampongbismarck079@gmail.com",
              to: user.Email,
              subject: "Password Recovery",
              html: `
                ${user.StageName} <br>
                <div> Please visit this link to enter your new password
                  <span>
                    Note: The link will expire within the next 24 hours!
                  </span> <br>
                  <a href="${recoveryURL}">${recoveryURL}</a>
                </div>
              `
            };
        
            Transportor.sendMail(mailOption, (err, done) => {
              if (err) {
                res.status(400).send(err);
              } else {
                res.render("Electro-Post/Massage-Delivery.ejs", { message: "ghost are here" });
                return done;
              }
            });
          } else {
            // Handle case where user is not found
            res.status(404).send("User not found");
          }
        });           
     //     
      
     // here we are going to be dealing with the after
       
      UserRouter.get("/recovery",async(req,res)=>{
           const tokenvalue  = req.query.token; 
            const  userid = req.query.userid;
             
  const user  = await UserIdentity.findOne({_id : userid});
           const cheker =   verifyToken(tokenvalue);
           if(cheker === "GoodLink"){
                 res.render("Electro-Post/Password-Recreation",{user})
           }else{
                res.status(400).send("there was an error")
           }
           
      })
       
     //   here for the getting of the value of the password
      UserRouter.post("/recorvery/:userid",async(req,res)=>{
           let userid  = req.params.userid
            console.log(userid);
             console.log(req.body.Password)
            var userNow  = await UserIdentity.findOne({_id:userid})
             console.log(userNow)
             if(userNow){

               userNow.Password  = req.body.Password;
             await   userNow.save();
              res.render("LandingPage.ejs",{userNow});
             }else{
                 res.status(400).send("there is some wrong with the password")
             }
               
      })
      

      //  for the style and other static file
       UserRouter.use(express.static("public"));
  // for the logout and other
    UserRouter.get("/logout",authenPerson,async(req,res)=>{
        let user = await UserIdentity.findOne({_id : req.auth_id});
      //  here is the option 
       res.render("./Electro-Post/log_out.ejs",{user});
    })
  UserRouter.get("/:ans/log_out",(req,res)=>{
      let thing = req.params.ans;
       if(thing === "Yes"){
         res.clearCookie("UserToken");
          res.redirect('/');
       }else{
        res.redirect('/');
      }
     
  })
   
    // connect -- router for the handling of the connecttion
    UserRouter.get("/connect/:user_id/to/:to_be",async(req,res)=>{
      // checking the userid
       let connector_user = req.params.user_id;
        let to_be = req.params.to_be
        let userinfo  =  await UserIdentity.findOne({_id : connector_user})
          let to_be_info = await UserIdentity.findOne({_id:to_be});
        
//  checking if already in the list of connectors
    if(to_be_info.Id_connectord.includes(connector_user)){
              let index_now  =to_be_info.Id_connectord.indexOf(connector_user);
              //  remove it 
              to_be_info.Id_connectord.splice(index_now,1);
              // DECREASE
               to_be_info.Number_Connectors-=1;
                to_be_info.save();

                  
                //  for identifier-content
                 let iden_content = {
                     hitman_id : connector_user,
                      massage : "Connect",
                       current_Number : to_be_info.Number_Connectors
                 }
                 
                //   sending the info through socket
                   io.emit(connector_user,iden_content);
   res.json({result : "isGood"})
     }else{
        //  push intoo the array 
         to_be_info.Id_connectord.push(connector_user);
//  increase the count
       to_be_info.Number_Connectors+=1;
     // Now storing the connector into the  
       to_be_info.save();

       let iden_content = {
        hitman_id : connector_user,
         massage : "Disconnect",
          current_Number : to_be_info.Number_Connectors
    }
    
   //   sending the info through socket
    //emit this change to other class of the smae thing
      io.emit(connector_user,iden_content);
    

   res.json({result : "isGood"})
    }
  })

 
  


module.exports = UserRouter