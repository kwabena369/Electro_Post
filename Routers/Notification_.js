//  sending of alert through email and other
   
 const express = require('express');
  const NotificationRouter =express.Router();
   
    NotificationRouter.use(express.static("public"))
//    for the db 
const UserIdentity = require('../model/UserIdentity');
 const PrototypeInfo = require("../model/Project-User"); 
 const  NoticificationDB = require("../model/Notification");  
  // for the utils
const {authenPerson} = require('../util-staff/authenUser');
const getUser_Noti = require('../util-staff/the_getting_userNotification');

 
  
//    for the normal notify user in the app 
 NotificationRouter.get("/comment_o_p",async(req,res)=>{
    //  for the getting  of though post belowing 
    //  to the  user -- where the property of the shceman 
    //  is going to be set to not check when ever there is  new comment in the user place 
    //  unless the user revisit that link again  and it going to be rest
 let user_who_commented = await UserIdentity.findOne({_id : req.query.user_id});
 let Prototype_info = await PrototypeInfo.findOne({_id :  req.query.post_id}).populate("currentUser");
// if all are good
 if(user_who_commented && Prototype_info){
    // notify the specific userof post
    //   go there into the db of the notfication tab
    //   --create one instance where 
    //   -- type of noti 
    //  --  massage 
    //  so when they vesit the place where all antofi ation are found
    //   the value of the thing wantn't be change unless the real thing is nit
    //      the sign is going to be cheking in the db for the install of noti
    //  when has the field to be not check   it is going to be shown 
    //  what more --each room so that when the user  visit that 
    //  place all the nofication with that -- for room would be maked as checked.
    
      //  the condition if the username is not equal
           
    let now_Noti = new NoticificationDB({
           Of_Kind  :"Comment_Alert",
           Associated  : Prototype_info,
            currentUser : user_who_commented,
             Status : "N_C"
    })
     
      try{
        //  this is going to mean that when ever there is a chat in the section 
        //  there is going to be a notication  which should not be the case
        //   notify if only the user is not present there at the chat room 
        //   and how are we going to no that , this can be than through the use 
        // of the socket or am lying ok let make it in a 
        //  classify a chat as -- notification 
        //  only base on the folling 
          // -- the owner of the is not there at the moment
            // { knowing the present the user socket is going to do}
          //  or when  the user chating is not equal to the ownner
          let done = await now_Noti.save(); 
           res.json({result:"it done"});

       
            
      }catch(err){
        console.log(err);
        console.log("could not do the saving");
         res.json({result:"not good"});
      }



}   
 })



//   for the authentication
// here is for bringing out notification massage
NotificationRouter.get("/massage",authenPerson,async(req,res)=>{
   // current user
   let user_now  = await UserIdentity.findOne({_id : req.auth_id})
  //   finding the user with thenotification vsalie of them 
   let getUserN = await getUser_Noti(user_now._id)
  // the   each of the  association available we are going
  //  to be cheking the number of user ther

    let the_once = await Promise.all(getUserN.map(  async(element)=>{
       let proto_now = await PrototypeInfo.findOne({_id :element._id});
      return  {
// this is for the prototype 
// which do have new comment in there
         user_Proto_info :proto_now ,
          Number_Of_new  : element.statusCount
       }
    })
    )

      //  console.log(the_once)
    res.render("./Electro-Post/Notification/home_land.ejs",
    {list:the_once,user:user_now})
 })
 


//  making the router available for other
 module.exports = NotificationRouter;