// dealing with the prototype staff
 const express = require("express");
  const multer = require("multer");
   const path  = require("path")
    const mongoose = require("mongoose")
    const fs = require("fs");
  const PrototypeRouter  = express.Router();
PrototypeRouter.use(express.static("public"))
   const useridentity = require("../../model/UserIdentity");
//     database schema
const PrototypeInfo = require("../../model/Project-User");
const UserIdentity = require("../../model/UserIdentity");
const jwt  = require("jsonwebtoken");
const cokieParser = require("cookie-parser")
PrototypeRouter.use(cokieParser())
 const bodyParser = require("body-parser");
const comment_db = require("../../model/comment_db");
const { decrypt_chat } = require("../../util-staff/chat_encode_decoder");
PrototypeRouter.use(bodyParser.urlencoded({ extended: true }));
 
 const notificationDB  =require("../../model/Notification")

// for the reply
 const comment_reply = require("../../model/replay_db");




//  for the io -- for realtime updating

//  setting up the file system 
   const ProfileAll = fs.readdirSync("./public/pp/");
    // console.log(ProfileAll)
//  here we are mapping them 
     const NewProfileAll  =  ProfileAll.map(file=>{
      //  here we set the thing 
      return {
        Userhandle:
        path.parse(file).name.split("-")[0]
        ,
       PrototypeN:
        path.parse(file).name.split("-")[1]
        ,
        id:
        path.parse(file).name.split("-")[2]
        ,
        url: `/prototype/display?file=${encodeURIComponent(file)}`
    }
    //  here that is going to mean that the first part of the name 
      // taken 
    })

   

  
 
//  here is for the multer which deal with the uploading of the  image
      const storage =  multer.diskStorage({
         destination  : (req,file,cb)=>{
  
          //  deciding on where to be stroing of the other file
           if(file.fieldname === "prototype_files"){
            cb(null, path.join(__dirname, './../../public/pp_files/'));
           }else if(file.fieldname === 'file_1' ||
                 file.fieldname === 'file_2'||file.fieldname === 'file_3'){
                    if(!file.originalname){
                       console.log("there way empty section");
                       cb('No file was selected', null);
                       return;
                    }
                    cb(null, path.join(__dirname, './../../public/pp/'));
                 }
        },
          filename : (req,file,cb)=>{
             cb(null,"-"+ file.fieldname +"-"+req.body.prototypeName 
              +req.auth_id+"-"+Date.now()+file.originalname);

}
      })

      //  bring in the filters
        const {imagefilter,filefilter} = require("../../util-staff/filters");
const { get_Number } = require("../../util-staff/Send_Normal_app_notici");
const sendEmail = require("../../util-staff/sendEmail");
const { sendMail } = require("../../util-staff/sendEmail");
const snippet_chat = require("../../model/snippet_chat");
    
  
  
      const uploader = multer({storage : storage });

      // ,
      // fileFilter : function(req,file,cb){
      //     // for the preview
      //      if(file.fieldname === "preview"){
      //                    imagefilter(req,file,cb)
      //      }else if(file.fieldname === "prototype_files"){
      //       filefilter(req,file,cb)
      //      }
      // }
      
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
        async function requireAuth(req, res, next) {
          const userTok = req.cookies.UserToken;
          res.locals.tags = array_tags;
          if (!userTok) {
            req.userTok = "Not Log"
            res.locals.logIn_SignIn = false;

            //   here is the setting of the vlaue 
            if (req.url.match(/^\/prototype\/one_now\/.*$/) || !userTok) {
              next();
            } else {
              res.send("token is not there");
            }
          } else {
            try {
              let Goldenlock = jwt.verify(userTok, "pickthecup");
              res.locals.logIn_SignIn = true;
        
              req.auth_id = Goldenlock._id;
              req.user_now = await UserIdentity.findOne({ _id: req.auth_id });
             
              try {
                let value = await get_Number(req.user_now);
                 res.locals.user = req.user_now
                res.locals.Number_Notification = value;
                next();
              } catch {
                res.status(400).send("something not good");
              }
            } catch (err) {
              res.send("No working Bro");
            }
          }
        }

PrototypeRouter.use(requireAuth);
//  for the 
PrototypeRouter.use('/one_now', express.static("public"));

//for specific
PrototypeRouter.get("/one_now",async (req, res) => {
  //   here is for the cae where the valuie of the rom the noti
  //  is set 
    
  
   
   let form_noti = req.query.form_noti;
  try {
    //  for the userid
     let proto_id = req.query.proto_id
      // for the smmall chat thing
     let small_chat =
     await snippet_chat.find({Specific_Fault_Proto :proto_id })
    const specificPro = await PrototypeInfo.findOne({_id: proto_id }).populate("currentUser");
   
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

    

 


    let connection_status ;
     let user =req.user_now;
    if(user){
        //  for the btn connect content
    if(specificPro.currentUser.Id_connectord.includes(req.user_now._id)){
        connection_status = "Disconnect"
       }else{
        connection_status = "Connect"
      }
    }else{
      connection_status = "Connect"
    }

   

//  getting the comment with that prototype id
  let comment = await comment_db.find({ protype_Id: proto_id })
  .populate("currentUser")
 
     let new_comment  = await Promise.all( comment.map(async single_man =>{
      // here we can be taking the id of the comment going to into the db of 
      //  the for the reqply so
      // so pick one
       let _array_subcomment = await comment_reply.find({_kind_of_mother :single_man._id})
                //  the numbere of subcomment under there
                  let number_under_there = await comment_reply.count({_kind_of_mother :single_man._id})
        // decrypt each here 
         let dingo_chat  =  decrypt_chat(single_man.chat_content);
      //  retunr the new holy array
       return {...single_man,chat_content : dingo_chat,reply : _array_subcomment,each_count:number_under_there};
        
         }))
  

    
   
    if (specificPro) {
        
       if(comment){ 
          if(user){
            res.render("Electro-Post/Prototype/S-Proto.ejs", 
            { S_Pro: specificPro,connection_status,user,
              dis_three_dot,user_comment : new_comment,
              small_chat:small_chat });    
           
          }else{
            res.render("Electro-Post/Prototype/Not_Login_SignUp.ejs", 
            { S_Pro: specificPro,connection_status,user,dis_three_dot,
              user_comment : new_comment,small_chat:small_chat });    
          }
           }else{
            if(user){
              res.render("Electro-Post/Prototype/S-Proto.ejs", 
              { S_Pro: specificPro,user,
                connection_status,dis_three_dot,user_comment: null,small_chat:small_chat});    
           
            }else{
              res.render("Electro-Post/Prototype/Not_Login_SignUp.ejs", 
        { S_Pro: specificPro,user,connection_status,dis_three_dot,user_comment: null,
          small_chat:small_chat});    
                }            
       
                //   for ther comment and other
      }
    } else {
      res.status(404).send("No prototype found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


//  array of tags
 


  // for the uploading_X  
   PrototypeRouter.get("/new_X",requireAuth,async(req,res)=>{
    //   this 
    res.render("Electro-Post/Prototype/form_uploading_file.ejs");
  })

  PrototypeRouter.post("/_new_upload_X",uploader.fields ([
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
  
     let {descriptionPrototype,title} = req.body
    
      // for the filename 
       if(userNow){
        // Fixing it into the database
        const newPrototype = new PrototypeInfo({
          protypeName:title,
          discribePrototype : descriptionPrototype,
           _tag_array : req.body.tag_array,
            currentUser  : userNow._id,
             pp :the_file_we_are_going_with[0].name,
            _arraypp  : the_file_we_are_going_with,
            //   in the case 
             _arraypp_file : _file_name
       }) 
    
  
  let done_pro_Creation  = await newPrototype.save();
  console.log(done_pro_Creation);
  
  }
    res.redirect('/');
     
     })


 module.exports =PrototypeRouter
 
 