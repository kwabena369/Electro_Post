// here is for the chat handling not dispaly
const express = require('express');
const { authenPerson } = require('../../util-staff/authenUser');
 const chatRouter = express.Router();
  const path = require("path")
  const multer = require("multer")
  
  // for the db
   const comment_db =  require("../../model/comment_db");
 const useridentiy_db = require("../../model/UserIdentity")
  const prototype_db = require("../../model/Project-User");
   const reply_db = require("../../model/replay_db");
const { send_noti } = require('../../util-staff/Send_Normal_app_notici');
// for the folder creation 
 const fs  = require("fs");
//  for the multer to handle the file thing
 
  let storage = multer.diskStorage({
     destination  : (req,file,cb)=>{
      const destinationPath = 
      path.join(__dirname, '..', '..', 'public', 'chat_image');
       fs.mkdirSync(destinationPath,{recursive:true})
       cb(null,destinationPath)
     },
     filename  : (req,file,cb)=>{
      //  the name of the file
       cb(null, req.params.fault_id+"-"+new Date().toDateString()+file.originalname)
     }
  })
  
  
   let uploader_image = multer({storage:storage})
 
  
//    here no one can acees this router onless is a user
  chatRouter.use(authenPerson)
  
  const io = require("../../server");
const Faults = require('../../model/Faults');


//  for a chat
 chatRouter.post("/one_comment/p",async(req,res)=>{
//  checking if the user is present 


//  for one of the comment 
 let incoming_comment = req.body.comment;
 let proto_id = req.body.proto_id;

  



   let user_now =  await useridentiy_db.findOne({_id : req.auth_id});
    // testing the availabitity of the user_now
    //  finding the prototype
    let prototype_Real = await prototype_db.findOne({_id : proto_id}).populate("currentUser");
     if(user_now && prototype_Real){
       console.log("a real user and protype...")
      // saving of the cmment
      let now_comment =  new comment_db({
          currentUser  : user_now._id,
           protype_Id : proto_id,
            chat_content :incoming_comment
                })
            //  saving the chat


            // update the number of comment

          prototype_Real._Number_Comment+=1;
           prototype_Real.save();  

          
             try{
              //  ghost_night
          let hope =    await now_comment.save();
            // if the comment is save
            //  check if it is the  currentUser
            // the same us the one who did it 
            res.json({id:hope._id})
            if(user_now.id !==prototype_Real.currentUser.id){
              //  if there are not equal
              //  no need for the nofication
              send_noti(prototype_Real.currentUser.id,prototype_Real._id)
              console.log("this is not for the owner.......");
               } else{
              //   make the notification command
              //   alerting that this is the ownner comment
               console.log("this is for the owner");
             }
             
             }catch(err){
              res.json({id:null})
                console.log("there was an err"+err)
             }
        }

 })

 chatRouter.post("/one_comment/f",async(req,res)=>{
  //  checking if the user is present 
  
  
  //  for one of the comment 
   let incoming_comment = req.body.comment;
   let proto_id = req.body.fault_id;
  
  
  
     let user_now =  await useridentiy_db.findOne({_id : req.auth_id});
      // testing the availabitity of the user_now
      //  finding the prototype
      let prototype_Real = await Faults.findOne({_id : proto_id}).populate("currentUser");
     
       if(user_now && prototype_Real){
         console.log("a real user and protype...")
        // saving of the cmment
        let now_comment =  new comment_db({
            currentUser  : user_now._id,
             protype_Id : proto_id,
              chat_content :incoming_comment
                  })
              //  saving the chat
  
  
              // update the number of comment
  
            prototype_Real._Number_Comment+=1;
             prototype_Real.save();  
              console.log(prototype_Real)
            
               try{
                //  ghost_night
            let hope =    await now_comment.save();
              // if the comment is save
              //  check if it is the  currentUser
              // the same us the one who did it 
              
              //  after the saving of the comment we are going 
              //  send the id to the people 
              //  hope
               res.json({id:hope._id})
               
              if(user_now.id !==prototype_Real.currentUser.id){
                //  if there are not equal
                //  no need for the nofication
                send_noti(prototype_Real.currentUser.id,prototype_Real._id)
                console.log("this is not for the owner.......");
                 } else{
                //   make the notification command
                //   alerting that this is the ownner comment
                 console.log("this is for the owner");
               }
               
               }catch(err){
                 res.json({id:null})
                  console.log("there was an err"+err)
               }
          }
  
   })
   
  

    // here id for the comment of the image 
 chatRouter.post("/image/:fault_id_type",uploader_image.single("file"),async(req,res)=>{
  //  here is the strooing into the db
    //  here the name of the file is going to be store in the comment
    //  secction as a simple text
    //  is for the name of the chat fom 
    // /comment/image/"<%=S_Pro._id%>"
    //  console.log(req.file)
//  let k
//  here is for the need for checking 
//   wheathere there
 console.log("am been called")
 
     let specific_fault_id =  req.params.fault_id_type.split("_")[0]
     let of_Kind_now_here =  req.params.fault_id_type.split("_")[1]
      console.log(of_Kind_now_here);
        //find it and then store it as a comment 
        let specific_fault_room
        if(of_Kind_now_here === "f"){
           specific_fault_room =await Faults.findOne({_id : specific_fault_id}); 
         }else{
           specific_fault_room =await prototype_db.findOne({_id : specific_fault_id}); 
         }
        
          // findign the currentuser
             let currentuser = await useridentiy_db.findOne({_id : req.auth_id});
         if(specific_fault_room && currentuser){
           try{
        console.log("this file is coming from a real user");
  
            //  here is the creation 
            // of the new kind of the commnet
            let comment_now = new comment_db({
               protype_Id : specific_fault_room,
               currentUser :   currentuser,
                Of_kind :"image",
                 chat_content : req.file.filename
            })
             
            //  saving the deal 
              let done = await comment_now.save()
               if(done){
                 console.log(done);
                console.log("the comment image is saved in the db ");
                    }
           }catch(err){
           console.log(err);
           }
         }
         req.query.fault_id  = specific_fault_room.id
 })


//  -----like for the comment----
//  here is when user c;lick on the like btn 
chatRouter.post("/action_on_comment",async(req,res)=>{

   
     // finding to see if there is comment like that
  
        //  finding out about the user who just like
         let user_Now = await useridentiy_db.findOne({_id  : req.auth_id});
          // here is for the cheking to see wheather is a like or the other
 if (user_Now) {
  //  finding if it is a real comment
  //  that the person did like
  let comment_here = await comment_db.findOne({_id : req.body.action.split("_")[1]}) 
  let kind_of = req.body.action.split("_")[0]
   if(kind_of === "LIKE"){
       // check wheathere it is already in the system of like
       if(comment_here.People_who_like.includes(user_Now._id)){
         console.log("user already like this post")
         //  here is nothing to be done 
       
   }else{
      // this is the case  where the user is now liking the post
      //  it can be the case where the user did already dislike the thing

      if(comment_here.People_who_dislike.includes(user_Now._id))
       {
         //   then do the removal of the thing from the db
          let index_of  = comment_here.People_who_dislike.indexOf(user_Now._id);
           //  splicing it out
             comment_here.People_who_dislike.splice(index_of,1);
             //   decrese the value
              comment_here.Number_dislike+=-1;
               
               // then do the oppsosite for the other side
                
               comment_here.Number_Like+=1
               comment_here.People_who_like.push(user_Now._id);
              await  comment_here.save();
                
       }else{
           comment_here.Number_Like+=1
         comment_here.People_who_like.push(user_Now._id);
       await comment_here.save();   
       }
      
       
        }        
      
   }
   //  here is for the dislike same as the othere one 
   if(kind_of === "DISLIKE"){
     // check wheathere it is already in the system of like
     if(comment_here.People_who_dislike.includes(user_Now._id)){
       console.log("user already dislike this post")
       //  here is nothing to be done 
     
 }else{
   //  increase the number of dislike
   //  but wait before that we check if the person is the like array 
   //   so we take that out and decrese it
   //  push that into the array 
      
    if(comment_here.People_who_like.includes(user_Now._id))
     {
       //   then do the removal of the thing from the db
        let index_of  = comment_here.People_who_like.indexOf(user_Now._id);
         //  splicing it out
           comment_here.People_who_like.splice(index_of,1);
           //   decrese the value
            comment_here.Number_Like+=-1;
             
             // then do the oppsosite for the other side
              
             comment_here.Number_dislike+=1
             comment_here.People_who_dislike.push(user_Now._id);
        await     comment_here.save();   
              
     }else{
       comment_here.Number_dislike+=1
       comment_here.People_who_dislike.push(user_Now._id);
      await  comment_here.save();   
     }
    
     
      }        
    
 }
  
  // sending the state of the number of the like and dislike
   res.json({result:true,like:comment_here.Number_Like,dislike:comment_here.Number_dislike})
}else{
  //   sending the user to the login
   res.redirect("/user/logIn")
 }
})

//  here is finding the replay for a comment 
 chatRouter.post("/all_repaly_for",async(req,res)=>{
  //   here is the making of the goldem
   
//   //  but am hungry
    if(req.body.content){
       let content = req.body.content
 // storing it in the that parcticlar section for the
    //  this is finding the kind of comment which did receive the hit 
     
    let now_pact_comment = await comment_db.findOne({_id:content.pacticul_comment})
 console.log(now_pact_comment);
     //         // it is valid
         if(now_pact_comment){
     
       try{
        let one_reply_here  = new reply_db({
          content : content.content,
          _kind_of_mother :  now_pact_comment._id
     })
 one_reply_here.save()     
       }catch{
         res.status(400).send({result:false})
       }
         }
         else{
          res.status(400).send({result:false})

         }
    }
   
 console.log(req.body.content.pacticul_comment)
 })
     module.exports  = chatRouter