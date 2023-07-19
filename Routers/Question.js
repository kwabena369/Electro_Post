const express = require('express');
const QuestionRouter = express.Router();
QuestionRouter.use(express.static("public")) 
const bodyParser = require("body-parser");

QuestionRouter.use(bodyParser.urlencoded({ extended: false }));
QuestionRouter.use(bodyParser.json());

QuestionRouter.use(express.json())

 const multer = require("multer")
  const fs =require("fs")
  const path = require("path")
 const io = require("../server")
  //  bringing in the socket thing
 
   

   const notificationDB = require("../model/Notification");
    const comment_db = require("../model/comment_db");
     
     
    const {get_Number} =require("../util-staff/Send_Normal_app_notici")
    //  for the utilf
     const {decrypt_chat} = require("../util-staff/chat_encode_decoder")

//  the multer uploader
const storage =  multer.diskStorage({
    destination  : (req,file,cb)=>{
//  for the destination fo the othere fault preview
         cb(null,path.join(__dirname, './../public/fault_pp/'));
   },
     filename : (req,file,cb)=>{
        cb(null,"-"+req.body.prototypeName 
         +req.auth_id+"-"+Date.now()+file.originalname);

}
 })


   io.on("connection",()=>{

   })

//   setting up the uiploader
  

  

//  for the db  
 const useridentity  = require("../model/UserIdentity");
const { imagefilter } = require('../util-staff/filters');
const fault_db = require("../model/Faults");
const UserIdentity = require('../model/UserIdentity');
const comment_reply = require("../model/replay_db");
const uploader  = multer({storage  : storage,fileFilter : imagefilter})

 
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

// for authentication 
  async function requireAuth(req,res,next){
     let jwt = require("jsonwebtoken")
     res.locals.logIn_SignIn = false;
    const userTok  = req.cookies.UserToken;
     if(!userTok){
        //  here are the thing the user is usppose to get there without the  
        //  authen 
         if(
          req.url === "/^\/one_now_fault\/./*/"  ||req.url === "/^\/./*/" 
          ){
           next(); 
            user = null
           }else{
            //   the usre not i nthe system 
        res.send("there is not token ")
            return;
           }
     }
  
   
      
           try{
            res.locals.logIn_SignIn = true;
           let Goldenlock = jwt.verify(userTok,"pickthecup");
            // console.log(Goldenlock)
             req.auth_id = Goldenlock._id
              //  here am going to be setting the variable for the tag 
               res.locals.tags = array_tags;
              //  finding the user 
               let usernow = await UserIdentity.findOne({_id : req.auth_id});
                 if(usernow){
                  req.usernow  = usernow
                  req.user_now = usernow
                   res.locals.user =usernow
                 }else{
                   res.status(500).send("fault");
                 } 

                 try {
                  let value = await get_Number(req.user_now);
                  res.locals.Number_Notification = value;
                } catch {
                  res.status(400).send("something not good");
                  return;
                }
              next()
            }catch (err) {
             res.send('No working Bro');
             console.log(err);
           }
     }

     QuestionRouter.use(requireAuth);

 QuestionRouter.get("/",async(req,res)=>{
      //  for all fault view
       let fault = await fault_db.find().populate("currentUser");
       console.log(req.auth_id);
       
        res.render("./Electro-Post/Question_/all_fault.ejs",{
          all_fault : fault,user: req.usernow});
  })
  //  
      
     //   here is the view single fault
      //  here is for the seving of the styatic file 
QuestionRouter.use('/one_now_fault', express.static("public"));



//    the middleware
     



  // fetch(`/question/reputation_vote/?kind=${down}&&proto_id=${proto_id}`).then(
  //  for the voting  of the othere
    QuestionRouter.get('/reputation_vote',async(req,res)=>{
      //  do the thing
          let kind = req.query.kind;
          let proto_id = req.query.proto_id 

           console.log(proto_id)
          //   for the checking of the db to see it
      
     if(kind === "down"||kind === "up")
     {
      // do the thing 

  //  finding the specific fault kind
   try{
    let right_fault = await fault_db.findOne({_id : proto_id});
     
       if(!right_fault){
         res.status(500).send("fault kind not in the db");
           return
        }else{
    //   finding wheather the person is in the set
       let upvoted = right_fault.Up_promoter.indexOf(req.usernow._id);
       let downvoted  = right_fault.down_promoter.indexOf(req.usernow._id);
 console.log(right_fault.Up_promoter)
 console.log(downvoted)
       if(kind ==="up"){
         if(upvoted === -1){
          //  this mean that the user is new to the hit of this btn
           right_fault.Up_Count++;
               right_fault.Up_promoter.push(req.usernow._id)
        //  but what if the user have already down like
         if(downvoted !== -1){
          //  this mean user have ready downliked
          right_fault.down_Count--;
          right_fault.down_promoter.splice(req.usernow._id,1)
          res.json({status_vote:{up:right_fault.Up_Count,down:right_fault.down_Count}})
        }else{
 // when in the first instance
 res.json({status_vote:{up:right_fault.Up_Count,down:right_fault.down_Count}})
           
          }
         
         }

        }
        if(kind === "down"){
         if(downvoted === -1){
                // this mean the user is new to this down vote
                right_fault.down_Count++;
                right_fault.down_promoter.push(req.usernow._id)


                if(upvoted !== -1){
                  //  this mean user have ready downliked
                  right_fault.Up_Count--;
                  right_fault.Up_promoter.splice(req.usernow._id,1)
                   res.json({status_vote:{up:right_fault.Up_Count,down:right_fault.down_Count}})
                  }else{
                    res.json({status_vote:{up:right_fault.Up_Count,down:right_fault.down_Count}})
                  }
         }
        }
  right_fault.save()
  }
   }catch(err){
      console.log(err);
   }     


     
   

     }      
           
    });

    // here is the golden at of magic =<
    
     let snippet_chat = require("../model/snippet_chat");
    

     //for specific
QuestionRouter.get("/one_now_fault",async (req, res) => {

  //   here is for the cae where the valuie of the rom the noti
  //  is set 
   let form_noti = req.query.form_noti;
  //  if from there we are comening to 
  // change the value of the statu there
   try {
    //  for the userid
  
     let proto_id = req.query.fault_id
    const specificPro = await fault_db.findOne({_id: proto_id }).populate("currentUser");
    if(req.user_now !== undefined){
      //  checking if the user in the db for the viewer
          if(specificPro._Specific_Viewer.includes(req.user_now._id)){
            //  then there is not going to be an action 
             
          }else{
            //   hhere wew are giing to be pushing it
             specificPro._Specific_Viewer.push(req.user_now._id);
              // then wew are increacing the number of view
               specificPro._Number_View+=1
               specificPro.save();
          }
     } 
 
    if(form_noti && req.auth_id !== null){
        //  here we are going to be deleting the nummber of 
        // notifcication with that kind of DB
  // let all_noti = await notificationDB.find({ Associated : specificPro})
   
    // mega 
     let all_1  = await notificationDB.deleteMany({Associated : specificPro})
   
      //  console.log(all_noti)        
       }
//  when there is not a specific use  like that
    if(!specificPro){
       res.redirect("/")
       return
    }
    


    let dis_three_dot
    // the condition for the displaying of three dot thing 
     if(specificPro.currentUser.id === req.auth_id){
       dis_three_dot = true
     }else{
       dis_three_dot = false
     }

    

 
   let user =  await useridentity.findOne({_id : req.auth_id})


    let connection_status ;
    
    if(user){
        //  for the btn connect content
    if(specificPro.currentUser.Id_connectord.includes(user._id)){
        connection_status = "Disconnect"
       }else{
        connection_status = "Connect"
      }
    }else{
      connection_status = "Connect"
    }

   

//  getting the comment with that prototype id
  let comment = await comment_db.find({ protype_Id: proto_id }).populate("currentUser")

  // deleteOne({protype_Id: proto_id})
   
  

  
     let new_comment = await Promise.all(comment.map( async single_man =>{
      //  here is for the reply for maybe a certain comment
      let _array_subcomment = await comment_reply.find({_kind_of_mother :single_man._id})
      let number_under_there = await comment_reply.count({_kind_of_mother :single_man._id})
        // decrypt each here 
         let dingo_chat  =  decrypt_chat(single_man.chat_content);
      //  retunr the new holy array
       return {...single_man,chat_content : dingo_chat,reply:_array_subcomment,each_count:number_under_there};
        
         }))

    
   
    if (specificPro) {
      let small_chat =
      await snippet_chat.find({Specific_Fault_Proto :specificPro })
        
       if(comment){ 
          if(user){
            res.render("Electro-Post/Question_/Single_fault.ejs", 
            { S_Pro: specificPro,connection_status,user,dis_three_dot,
              user_comment : new_comment,small_chat });    
           
          }else{
            res.render("Electro-Post//Question_/Single_fault.ejs", 
            { S_Pro: specificPro,connection_status,dis_three_dot,user,
              user_comment : new_comment ,small_chat});    
          }
           }else{
            if(user){
              res.render("Electro-Post/Question_/Single_fault.ejs", 
              { S_Pro: specificPro,user,dis_three_dot,connection_status
                ,user_comment: null,small_chat});    
           
            }else{
              res.render("Electro-Post/Question_/Single_fault.ejs", 
        { S_Pro: specificPro,user,dis_three_dot,connection_status,user_comment: null,
          small_chat});    
                }            
       
      }
    } else {
      res.status(404).send("No prototype found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

);

// for ediORIAL FRISTinstance
QuestionRouter.use('/edit', express.static("public"));


QuestionRouter.get("/edit",async(req,res)=>{
 
  
 let proto_id =req.query.proto_id;
   
//  finding the specific prototype
   try{
    let proto_now =  await fault_db.findOne({_id : proto_id})
     let prev_tag_here = proto_now._tag_array;
     console.log(prev_tag_here)
 if(proto_now){
    
  res.json({result:true,content:proto_now,prev_tag_here})
 }else{
   res.status(400).send("there is an erro in the back")
 }

   }catch(err){
     console.log(err)
   }
 


})



//  here is for the editoral section 
QuestionRouter.post("/edited_file",uploader.array("preview",3),async(req,res)=>{

  let standing_array=[];
  let no_d = false
    if(req.body.staff !==null ){  
                     // the undeleted array 
    standing_array = req.body.staff.split(",");
     // remaking the standing 
      standing_array = standing_array.map(element=>{
       return  {
       name : element
      }
     }) 
    }


  


  let proto_now = await prototypeinfo.findOne({_id : req.body.staff2})
 
       //  getting theo old array
let the_pp_array = await proto_now._arraypp;

if(!no_d){ 
//  the  container here id the checking of the othere set where there
//  is nothing

let current_working = [];

if(the_pp_array.length !== 0){


//  bring out array which were deleted
 current_working = the_pp_array.filter(element =>
 !standing_array.some(
   obj => obj.name.includes(element.name) ||
    element.name.includes(obj.name)
 )
);
  


//  deleting them
current_working.forEach(element  =>{
 delete_file("./public/pp",element.name,res);
})
}else if(standing_array.length === 0){
 // but if it is then we are dealing with 
 //  two thing either --- there person has 
 //  deleted all--
// delete the pp[one]

delete_file("./public/pp",proto_now.pp)
}


let only_name=[];
   //  for the once which get unloadde
  if(req.files.length !== 0){
     only_name =  req.files.map(element=>{
     return  {
     name : element.filename
             //  consoleloging the other
    }
              
   }) 
 }
 

 let f_array =[];
       if(standing_array === null){
   f_array   = only_name
       }else{
        f_array = only_name.concat(standing_array)
       }



       //  sentizing of the array  
        f_array = f_array.filter(element =>{
          return element.name !== ''
        })


       // for the setting the firtst preview
       console.log(f_array);
        proto_now.pp = f_array[0].name;
       proto_now._arraypp = f_array
       //  myTSL.setIntegrationTime( t ) 

}


     //  saving the old thing 
 proto_now.discribePrototype = req.body.descriptionPrototype
 proto_now.protypeName = req.body.prototypeName
         await proto_now.save()
             


     //  sending back to the same proto
res.redirect(`/prototype/one_now/?proto_id=${req.body.staff2}`)

})


  // for the uploading_X  
  QuestionRouter.get("/new_X",async(req,res)=>{
// for serving the form
    res.render("./Electro-Post/Question_/Question_form.ejs");
  })

QuestionRouter.post("/_new_upload_X",uploader.fields ([
  { name: 'file_1'},
  { name: 'file_2'},
  { name: 'file_3'},
  {name:"file_man"}
  ]),async(req,res)=>{

 
 let userNow = await useridentity.findOne({_id : req.auth_id})    
 let _file_name ;
  if(!req.files['file_man']){
     _file_name = null;
  }else{
    _file_name  = req.files['file_man'][0].filename
  }
   
  
  // here is gethering the file naem of the uploaded
   let the_file_we_are_going_with = [];
    
    if(req.files['file_1']){
      the_file_we_are_going_with.push({name :req.files['file_1'][0].filename});
    }
    if(req.files['file_2']){
      the_file_we_are_going_with.push({name :req.files['file_2'][0].filename});
    }
    if(req.files['file_3']){
      the_file_we_are_going_with.push({name :req.files['file_3'][0].filename});
    }

   let {descriptionPrototype} = req.body
  
    // for the filename 
     if(userNow){
      // Fixing it into the database
      const newPrototype = new fault_db({
        discribe_falut : descriptionPrototype,
         _tag_array : req.body.tag_array,
          currentUser  : userNow._id,
           pp :the_file_we_are_going_with[0].name,
          _arraypp  : the_file_we_are_going_with,
          //   in the case 
           _arraypp_file : _file_name
     }) 
  

let done_pro_Creation  = await newPrototype.save();
console.log(done_pro_Creation);

// //  saving the thing into the  database
//   await newPrototype.save().then( async()=>{
// //  finding the category which the user did select
//  let catgories = newPrototype._tag_array; 
// //  here we are the going to be 
// //  picking one by one the user in the db and chking thier value of interest 
// //  if  there is even on charactor in the categories which is found there in the db of the 
// //  of the person 
 
//   // here are the user who do like the 
//   // gettting of the alert on this proto
//    let all_who_like_noti = await useridentity.find({
//       interest_array : {$in : catgories},
//         getPrototype_alert : "Yes"
//    }) ; 
//     //after the getting sending of email to them 
//     all_who_like_noti.forEach(element=>{
//     let subject = "Prototype_Posted";
//      let content =`${userNow.Userhandle} made a prototype post with the title_${req.body.prototypeName}`
//     // sendMail(content,subject,element.Email)   
//       console.log(`email is been send to the user --${element.Email}`)   
//      })
   

//  //  seeing wheather thing are been saved
//   res.redirect("/");
//        }).catch(error =>{
//          res.send("Couldnot save thing prototype")
//    })
   
}
 res.send("the thing ");
   
   })
   
  //  tag_array
// //    for  the  uploading of the fult
// PrototypeRouter.post("/new",uploader.array("preview",3),async(req,res)=>{
//   //  for the othere part 
//   let {descriptionPrototype} = req.body
//  if(req.files.length !==0){
// let now_fault  = new fault_db({
//       currentUser : req.usernow.id,
//       _tag_array : req.body.tag_array,
//       discribe_falut  : descriptionPrototype,
//        pp : req.files[0].filename
// })
// //  if the file length end up to be more

// //  making the array of filename
//   let file_name =  req.files.map(element=>{
//      return {
//        name : element.filename
//      }
//   })
// now_fault._arraypp =file_name

// //  saving it into the db
// try{
//     await now_fault.save().then( async()=>{
//   //  finding the category which the user did select
//    let catgories = req.body.tag_array.split(",")
//   //  here we are the going to be 
//   //  picking one by one the user in the db and chking thier value of interest 
//   //  if  there is even on charactor in the categories which is found there in the db of the 
//   //  of the person 
   
//     // here are the user who do like the 
//     // gettting of the alert on this proto
//     console.log(catgories);
//      let all_who_like_noti = await UserIdentity.find({
//         interest_array : {$in : catgories},
//            getEmail_falut : "Yes"
//      });
//       console.log("from the email sending side")
//       console.log(all_who_like_noti);
//       //after the getting sending of email to them 
//       all_who_like_noti.forEach(element=>{
//       let subject = "Fault_Posted";
//        let content =`${req.user_now.Userhandle} made a Fualt post with the description${descriptionPrototype}`
//       // sendMail(content,subject,element.Email)   
//         console.log(`email is been send to the user --${element.Email}`)   
//        })
     
  
//    //  seeing wheather thing are been saved
//          });
          
// }catch(err){
//     console.log(err);
// }

// res.redirect("/question") ;
// }else{
 
// res.status(500).send("please fill the file section")
// }
// }) 




   module.exports = QuestionRouter;
