const UserIdentity = require("../model/UserIdentity");

async function requireAuth(req,res,next){
  // const prototypes = await allthem.find().populate("currentUser");
  // let array_tags = [
  //   "Aerospace",
  //   "Electrical_En",
  //   "Computer_Engineering",
  //   "Rasperypi",
  //   "Marineenginnerring",
  //   "Thinkerkit",
  //   "Arduino",
  //   "Arduino",
  //   "Arduino"
  //  ]
  // //   here is the setting of the vlaue 
  //   res.locals.tags =array_tags

 let jwt  =require("jsonwebtoken");
 const userToken  = req.cookies.UserToken;
 if(!userToken){
  res.locals.logIn_SignIn = false;

       res.render("LandingPage.ejs",{prototypes});
       return;
    }
          try{
            res.locals.logIn_SignIn = true;
          let Goldenlock =  await jwt.verify(userToken,"pickthecup");
            req.auth_id = Goldenlock._id
             req.user_Now = await UserIdentity.findOne({_id : req.auth_id})
              res.locals.user=await UserIdentity.findOne({_id : req.auth_id})
             next()
           }catch (err) {
            let user  = await UserIdentity.find() 
            res.render("LandingPage.ejs",{prototypes,user});
          }
    }
    
    
    module.exports = {
       authenPerson : requireAuth
    }