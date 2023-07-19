const { TokenExpiredError } = require("jsonwebtoken");

 

async function Profile_Auth(req,res,next){
      let jwt = require("jsonwebtoken")
     const userToken  = req.cookies.UserToken;
      if(!userToken){
        req.auth_id = ""
   return;
     }
            try{
            let Goldenlock = jwt.verify(userToken,"pickthecup");
            //  console.log(Goldenlock)
              req.auth_id = Goldenlock._id
               next()
             }catch (error) 
              {
                if (error instanceof jwt.TokenExpiredError) {
                    res.redirect('/user/login');
                   }else{
                     res.status(400).send("there was an erro with the token");
                   }
                   
               
            }
      }
      
      module.exports  =  { 
          profile_Authen  : Profile_Auth
      }