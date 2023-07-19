const express = require('express');
//   router
 const snippet_chat  = express.Router(); 
  
//   for the db 
 const snippet_chat_db  =require("../../model/snippet_chat.js")
  const Proto_here = require("../../model/Project-User.js");
  const useridentity  = require("../../model/UserIdentity.js");
   
//    for the utiole function 
 const {authenPerson} = require("../../util-staff/authenUser.js");
  
  let fault_db = require("../../model/Faults.js")
  snippet_chat.use(authenPerson);
 //    done here the new chat
 snippet_chat.post("/new",async(req,res)=>{
    //  the saving of the chat
     let {staff} = req.body;
      console.log(staff);
    //   checking if real proto
    //  here we are going to be 
    //   deciding the field that is been use there
    let real_proto;
      if(staff.type_of === "proto"){
        real_proto = await Proto_here.findOne({_id : staff.pro_id})
      }else if(staff.type_of === "fault"){
        real_proto = await fault_db.findOne({_id : staff.pro_id})
        console.log
      }
      
      if(real_proto){
        let done_one_new_s_chat = new snippet_chat_db({
            content  : staff.the_real_deal,
             where_X  : staff.where_X,
             where_Y : staff.where_Y,
             Specific_Fault_Proto : staff.pro_id,
             of_kind  : staff.of_kind,
          }) 
            await done_one_new_s_chat.save().then(
     ()=>{
        res.json({result :"done in the db"});    
     }
 ) 
       
      }
   
 })
  
//   making it avai
 module.exports = snippet_chat