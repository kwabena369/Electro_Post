 const express = require('express');
  const settingRouter  = express.Router();
const bodyparser = require("body-parser")
 const bcrypt = require("bcryptjs")
   settingRouter.use(express.static("public"));
    settingRouter.use(bodyparser.json())
   settingRouter.use(bodyparser.urlencoded({ extended: true }));
   const {authenPerson}  = require("../util-staff/authenUser")
 const {delete_file} =require("../util-staff/delete_file")
  const path  = require("path");
  //  for the like
  const prototypeinfo =  require("../model/Project-User");
   const fault_db = require("../model/Faults")

 let fs = require("fs")
   //    for the db
  let  UserIdentity = require("../model/UserIdentity");
  let did_what_now =  require("../model/Did_what");
  let commenting_DB = require("../model/comment_db");
   settingRouter.use(authenPerson);

    // here is for the setting of the notification 
 settingRouter.get("/Notification",async(req,res)=>{
     let user = await UserIdentity.findOne({_id:req.auth_id})
  res.render("./Electro-Post/Profile_View/Notification_Options.ejs"
,{user ,setting:"yes"})
 })

 
settingRouter.get("/Account",async(req,res)=>{
  let user = await UserIdentity.findOne({_id:req.auth_id})
  res.render("./Electro-Post/Profile_View/Account.ejs",
  {user,setting:"yes" })

})

settingRouter.get("/Display",async(req,res)=>{
  let user = await UserIdentity.findOne({_id:req.auth_id})
  res.render("./Electro-Post/Profile_View/Display.ejs",
  {user,setting:"yes" })
})


settingRouter.get("/Privacy",async(req,res)=>{
let user = await UserIdentity.findOne({_id:req.auth_id})
res.render("./Electro-Post/Profile_View/Privacy.ejs"
,{user ,setting:"yes"})
})


   

 settingRouter.get("/",authenPerson, async(req,res)=>{
  let user = await UserIdentity.findOne({_id:req.auth_id})
       res.render("./Electro-Post/Profile_View/Account.ejs",
       {user,setting:"yes" })    
 })




settingRouter.get("/ch_pw",authenPerson, async(req,res)=>{
  
     if(req.auth_id !== ''){
           let user = await UserIdentity.findOne({_id  : req.auth_id})
        if(user){
            res.render("./Electro-Post/new_Password.ejs",
            {user,setting:"yes"})
           }else{
             res.status(400).send("this is not a good id");
           }
          }else{
             res.status(400).send("Bad thing happpens")
          }
  })
    
  settingRouter.post("/check_pw",authenPerson,async(req,res)=>{ 
        let  user = await UserIdentity.findOne({_id : req.auth_id})
         
         if(user){
          console.log(user)
          let pw   =  req.body.Password;
           console.log(pw)
           try{
              bcrypt.compare(pw,user.Password,(err,done)=>{
                 if(done){
        res.render("./Electro-Post/Password-Recreation.ejs",
        {user,massage : "New One",setting:"yes"})
                 }else{
res.render("./Electro-Post/new_Password.ejs",
{user,massage : "password incorrect",setting:"yes"})
               }
              })
           }catch(err){
              console.log(err);
             res.status(400).send("could not even do the brcy")
           }
         }
  })



      //  for the edit of email
 settingRouter.get("/editmail",authenPerson,async(req,res)=>{
   
  //   previous email 
    let user = await UserIdentity.findOne({_id : req.auth_id});
     let pre_email  = user.Email; 
     const emailvalue = req.query.email
      
      // founded email 
   const inther =  await UserIdentity.findOne({Email: emailvalue})
  if(inther !== null){
     
    const foundedmail  = inther.Email
    if(foundedmail !== pre_email){  
      res.json({isthere :true})
    }else{
     res.json({isthere :false})
      user.Email =emailvalue
      let done =   await  user.save();
       console.log(done);
      }
   }else{
    res.json({isthere :false})
    user.Email =emailvalue
    let done =   await  user.save();
     console.log(done);
   }


})


// here db for the education 
  const Education = require("../model/Education");
  const Employment_db = require("../model/Employment_db");
  const Did_what = require("../model/Did_what")

  settingRouter.post("/creadential2",authenPerson,async(req,res)=>{
     console.log(req.body)
     let name_position   = req.query.employment;
   let form_when =  req.query.from_when;
   let to_when =  req.query.to_when;
     let userhere  = await UserIdentity.findOne({_id : req.auth_id})
     let employ =  new Employment_db({
       Name_Position  :  name_position,
       currentUser  : userhere,
       From  : form_when,
       To  : to_when
     })
      // then saving of the sch
        let done = await employ.save();

        if(done){
 res.redirect(`/${userhere.Userhandle}`)
               }else{
                res.status(500).send("some wrong is in the back")
                  }            
   }) 

  //   here is for the other credential 
  settingRouter.post("/creadential",authenPerson,async(req,res)=>{
    console.log("am hit now am hit ....")
      let education   = req.query.education;
       
       
    let array_didwhat =  req.body.all_did_what    
      let userhere  = await UserIdentity.findOne({_id : req.auth_id})
      let educate =  new Education({
        Sch_Name : education,
        currentUser : userhere._id
      })
       // then saving of the sch
         let done = await educate.save();
 
         if(done){
       array_didwhat.forEach(async(element) => {
   //  for each of the didwhat  
    try{
     let one_didwhat =  new Did_what({
       Name : element,
        Place_did_it : done._id          
       })
    let done_Saving = await one_didwhat.save()
    }catch(err){
       console.log(err);
    }
    
                 
           });    
                // redirting of the user 
  res.redirect(`/${userhere.Userhandle}`)
                }else{
                 res.status(500).send("some wrong is in the back")
                  
                }
 
               //  for the finding of staff with that name
                 // let did_w_association = await Did_what.find({Place_did_it :{$in:done._id}})
                   
    }) 

   settingRouter.use('/edit_didwhat', express.static("public"));
    //   here is for the diting of the thing we did set
      settingRouter.get("/edit_didwhat",authenPerson,async(req,res)=>{
        //  serving the palce for the edit
           let sch_name = req.query.sch_name;
            
    try {
         // find it and sending all the -----didwhat--- associated with it 
          let current_shc = await Education.findOne({Sch_Name : sch_name});
           let user = await UserIdentity.findOne({_id : req.auth_id})
           if(current_shc){
              let didwhat_thing  = await Did_what.find({Place_did_it  : current_shc});
         
          res.render("./Electro-Post/User_Own/Editing_Sch_didwhat.ejs",
          {current_shc,didwhat_thing,user})
               
             }    
    } catch (error) {
      console.log(error);
    }
      })   
        
       
      //  this is for after the adding of the other file
       settingRouter.post("/save_sch_edit",authenPerson,async(req,res)=>{
          // here is the thing after the sabving 
         console.log(req.body)
        let pre_sch_name = req.body.pre_sch_name;
          let now_shc_name = req.body.sch_name;
         let value = await Education.findOne({Sch_Name : pre_sch_name})
           let array_didwhat =req.body.didwhat;
          
          // if the deleting of the ing is goingto be working
           if(value){
            let new_education =  await Education.updateOne({Sch_Name : now_shc_name});
       
          // here is for the deleting of the previous thing
  await did_what_now.deleteMany({Place_did_it : value._id})
  //  noe here we are going to be doing the saving
     if(new_education){
   array_didwhat.forEach(async(element) => {
//  for each of the didwhat  
try{
 let one_didwhat =  new did_what_now({
   Name : element,
    Place_did_it :  value._id         
   })
let done_Saving = await one_didwhat.save()
}catch(err){
   console.log(err);
}

             
       });    
        let userhere = await UserIdentity.findOne({_id : req.auth_id})
            // redirting of the user 
res.redirect(`/${userhere.Userhandle}`)
            }else{
             res.status(500).send("some wrong is in the back")
              
            }
 
 
   
              
          
        }
         
       })
   
    
     //   router for the didwhatprinting
    settingRouter.get("/find_did_what/", async(req,res)=>{
  
      //   cheking for that specific user
        try {
          let edu_value = req.query.edu
           let user_handle = req.query.handle
           console.log(edu_value);
            console.log(user_handle)

            let userNow = await UserIdentity.findOne({Userhandle : user_handle})
             
             //  finding user
             const education = await Education.
             find();
               
             //  at here we find all did what
//  let all_did_what = await Did_what.find({Place_did_it :{$in : education}})  
 let all_did_what = await Did_what.deleteMany({Place_did_it : education})  
           
  // console.log(all_did_what)
   res.json({result : all_did_what});      
 }catch(err){
            console.log(err)
        }
    })
    //  here is the router for the deleting of the thing
     settingRouter.post("/delete_sch",async(req,res)=>{
      //  here for same thing as the other
         let {pre_sch_name,sch_name,didwhat}  = req.body;

          // finding them and them deleting them 
        let sch_now = await Education.findOne({Sch_Name : pre_sch_name}) 
         if(sch_now){
           await Education.deleteOne({Sch_Name  : pre_sch_name})
               
           try{
   
            await did_what_now.deleteMany({Place_did_it  :sch_now._id })
            let userhere = await UserIdentity.findOne({_id : req.auth_id})
             res.redirect(`/${userhere.Userhandle}`)
          }catch{
            
          }
         
         }else{ 
           res.status(400).send(" this sch was not there in the system")
         }
          //  for the deleting of the didwhat 
         
          })
    

//   router for the handling of the user interest



 

   
  //  here if fo inserrest selection 
  settingRouter.get("/set_interest",authenPerson,async(req,res)=>{
    //  sending the interest page
     let userhere = await UserIdentity.findOne({_id : req.auth_id})
    let old_set = await Interest_dB.find({currentUser : {$in : userhere}});

    let singled_interest = old_set.map(elemn =>elemn.Intest_Name)
// saving the new thing
    userhere.interest_array=singled_interest
             userhere.save();
     res.render("./Electro-Post/User_Own/interest_Option.ejs",{already : singled_interest})
     
   })


     
     


    // for interesDB
 let Interest_dB = require("../model/interes_value");

  //   the saveing of the interest btn 
  settingRouter.get( "/interest_value",authenPerson,async(req,res)=>{
    let array_interest = req.query.interests.split(","); 
    //  checking the user
    let userhere  = await UserIdentity.findOne({_id : req.auth_id})
    userhere.interest_array = array_interest
    await  userhere.save()
    //  first  delete all the interest thing for the user previously
     await Interest_dB.deleteMany({currentUser : userhere})



 if(userhere){
  //   it is the ifrst tinme 
  try{
    array_interest.forEach( async element =>{ 
       
      let onehere  = new Interest_dB({
        Intest_Name  : element,
         currentUser : userhere
      })
       await onehere.save();
   })
  //  send to theomepage
   res.redirect("/")
    
  }catch{
      res.send("errror_here_pls");
  }
 
     
 }
    })
     
    
     
    

//  here is when user c;lick on the like btn 
  settingRouter.get("/like_it",authenPerson,async(req,res)=>{
      // we get the user id form the _ authen 
      //  for the post id form the params
       let post_id = req.query.post_id
 let proto = await prototypeinfo.findOne({_id : post_id});
       let user_Now = await UserIdentity.findOne({_id  : req.auth_id});
//   bring out the thing of the post een clike 
 console.log(proto)



       //  check if user is include 
 if(proto.likes.includes(user_Now._id)){
    console.log("user already like this post")
    // here we are going  to 
    // omit the user from the set 
    let current_One =   proto.likes.indexOf(user_Now._id);
    proto.Number_likes+=-1;
    proto.likes.splice(current_One,1);
      await proto.save()
     res.json({result : false})
 }else{
   proto.Number_likes+=1;
   proto.likes.push(user_Now)
  await proto.save()
  res.json({result : true})
   }

  })


  //  for the other thing of the editing and del

  settingRouter.use('/edit', express.static("public"));

 settingRouter.get("/edit",async(req,res)=>{
  
   
  let proto_id =req.query.proto_id;
    
 //  finding the specific prototype
    try{
     let proto_now =  await prototypeinfo.findOne({_id : proto_id})
  if(proto_now){
     
    res.render("./Electro-Post/Prototype/editing_page.ejs",
    {content : proto_now._arraypp,Proto : proto_now})
  }else{
    res.status(400).send("there is an erro in the back")
  }

    }catch(err){
      console.log(err)
    }
  
 

})
 
 const multer = require("multer")
const storage =  multer.diskStorage({
  destination  : (req,file,cb)=>{
//  for the destination fo the othere fault preview
if(file.fieldname === 'file_1' ||
file.fieldname === 'file_2'||file.fieldname === 'file_3'){
    cb(null,path.join(__dirname, './../public/pp/'));
   }else{ 
    cb(null,path.join(__dirname, './../public/fault_pp/'));

   }
  }
 ,
   filename : (req,file,cb)=>{
      cb(null,"-"+req.body.prototypeName 
       +req.auth_id+"-"+Date.now()+file.originalname);

}
})
const { imagefilter } = require('../util-staff/filters');
//   for the uploading setting 
const uploader  = multer({storage  : storage,fileFilter : imagefilter})
const Faults = require('../model/Faults');

//  for the editing for the fault thing
// /setting/u/edit_fault/?fault_id=<%=S_Pro.id%>
 settingRouter.get("/edit_fault",async(req,res)=>{
  let proto_id =req.query.fault_id;
 //  finding the specific prototype
    try{
     let proto_now =  await fault_db.findOne({_id : proto_id})
  if(proto_now){
     
    
   res.render("./Electro-Post/Question_/Editing_page.ejs",
   {content:proto_now._arraypp,Proto : proto_now})
  }else{
    res.status(400).send("there is an erro in the back")
  }

    }catch(err){
      console.log(err)
    }
  
 

})
settingRouter.use('/edit_fault', express.static("public"));
 
 settingRouter.post("/fault_editing",uploader.fields ([
  { name: 'file_1'},
  { name: 'file_2'},
  { name: 'file_3'},
  {name:"file_man"}
  ]),async(req,res)=>{

    let {descriptionPrototype,_deleted_file_in_there,Proto_id} = req.body

    _deleted_file_in_there = _deleted_file_in_there.split(",");

      // for the name of the file in the system
      //   deleted 
      let proto_now = await fault_db.findOne({_id :Proto_id })
//  here we are going to be doing the updating of thing here
 
await fault_db.updateOne({_id : Proto_id},
  {$set :{discribe_falut : descriptionPrototype,}}).then(
      console.log("the updating is done")
  )
  //  here is a check to see wheathere there is a delete of the main pp
     let main_pp = proto_now.pp;
     let is_deleted_main_thing
      
      try {
        console.log(_deleted_file_in_there)
   if (_deleted_file_in_there !== null) {
        _deleted_file_in_there.forEach(element=>{
          if(element === main_pp){
           //  then we are going to be 
           // making the main thing there to be first element in the array there
           is_deleted_main_thing = true;
          }else{
         is_deleted_main_thing =false;
          }
   
        })     
   }


      } catch (error) {
       console.log(error) 
      }


// then going into the folder to delete all the other files there
  
   if(_deleted_file_in_there !== undefined){
    //  then we are going to delete one by one
     _deleted_file_in_there.forEach(element=>{
        // finding the index there and the taking it out 
         
           let index_now_here  = proto_now._arraypp.findIndex(item => item.name === element);
            if(index_now_here !== -1){
            proto_now._arraypp.splice(index_now_here,1);
       delete_file("./public/fault_pp",element);
           }
          
     })
   }

  
  //  here we are going to be  gathering the element in the file section of the thing 
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
  
    //   
    console.log("there is a new file");
    console.log(the_file_we_are_going_with);
    // here is setting the thing into the array 
    the_file_we_are_going_with.forEach(element=>{
      proto_now._arraypp.push(element)    
    })
   

      if(is_deleted_main_thing){
         console.log("firts element deleted")
          // then suing the first elemetn of the array there
           proto_now.pp = proto_now._arraypp[0].name
      }

       try {
        await proto_now.save()
       } catch (error) {
        console.log(error)
       }
    

          //  sending back to the same proto
     res.redirect(`/question/one_now_fault/?fault_id=${proto_now.id}`)
     
 })



settingRouter.post("/delete",async(req,res)=>{
 
 let proto_id = req.body.proto_id;
//  finding the specific prototype
 let proto_now =  await prototypeinfo.findOne({_id : proto_id})
 
  //  FOR THE DELETING OF THE PP RPEFILE
   let _array_pp_file =  proto_now._arraypp;

//  usfing the foreach to delete one by one
 if(_array_pp_file.length !== 0){
 _array_pp_file.forEach(element =>{
    delete_file("./public/pp",element.name,res);
  })
}else{
  delete_file("./public/pp",proto_now.pp,res);
}
  //   for the file store in the file
  let _array_file_ = proto_now._arraypp_file;
    if(_array_file_ !== null){

        _array_pp_file.forEach(element =>{
        delete_file("./public/pp_files",element.name,res);
      })   
    }

    // now deleting the whole structure 
 
     try{
      await commenting_DB.deleteMany({protype_Id :proto_now })
      await proto_now.deleteOne({_id : proto_id}).then(
         res.redirect('/post_some')
    )    
     }catch(err){
        console.log(err);
         res.json({result :"not good"});
         }   
})






// for the deleting of the fault thing
settingRouter.post("/delete_fault",async(req,res)=>{
 
  let proto_id = req.body.proto_id;
 //  finding the specific prototype
  let proto_now =  await fault_db.findOne({_id : proto_id})
  
//  here is for the deleting 
//  pp in relation to the pp
  let _array_pp_file =  proto_now._arraypp;
 
 //  usfing the foreach to delete one by one
  if(_array_pp_file.length !== 0){
  _array_pp_file.forEach(element =>{
     delete_file("./public/pp",element.name,res);
   })
 }else{
   delete_file("./public/pp",proto_now.pp,res);
 }
   //   for the file store in the file
   let _array_file_ = proto_now._arraypp_file;
     if(_array_file_ !== null){
 
         _array_pp_file.forEach(element =>{
         delete_file("./public/pp_files",element.name,res);
       })   
     }
 
     // now deleting the whole structure 
  
      try{
        // for the deleting of all the chat inrelation to it
          await commenting_DB.deleteMany({protype_Id :proto_now })
         await proto_now.deleteOne({_id : proto_id})
//  after here we are going to be going to the 
//   db to find the once which have the same id and the one that we
// are dealing with here 

//   ---- here is the thint to do 
//  go into the folder which we now 
//  ---- then delete all the thing we the
  
  //  seeing the thing in the folder 
  fs.readdir("./public/chat_image",(err,files)=>{
    

     files.forEach(element =>{
         if(element.split("-")[0] === proto_id ){
          delete_file("./public/chat_image",element);
         }
     })
   })
 
          res.redirect('/post_some')
      
      }catch(err){
         console.log(err);
          res.json({result :"not good"});
          }   
 })
 


// edited_fault_file
//   for the proto editing 
 settingRouter.post("/edited_file",uploader.fields ([
  { name: 'file_1'},
  { name: 'file_2'},
  { name: 'file_3'},
  {name:"file_man"}
  ]),async(req,res)=>{
    let {descriptionPrototype,_deleted_file_in_there,Proto_id,title} = req.body

    _deleted_file_in_there = _deleted_file_in_there.split(",");

     console.log(descriptionPrototype);
      // for the name of the file in the system
      //   deleted 
      let proto_now = await prototypeinfo.findOne({_id :Proto_id })
//  here we are going to be doing the updating of thing here
 
await prototypeinfo.updateOne({_id : Proto_id},
  {$set :{discribePrototype : descriptionPrototype,protypeName : title}}).then(
      console.log("the updating is done")
  )
  //  here is a check to see wheathere there is a delete of the main pp
     let main_pp = proto_now.pp;
     let is_deleted_main_thing
      
      try {
        console.log(_deleted_file_in_there)
   if (_deleted_file_in_there !== null) {
        _deleted_file_in_there.forEach(element=>{
          if(element === main_pp){
           //  then we are going to be 
           // making the main thing there to be first element in the array there
           is_deleted_main_thing = true;
          }else{
         is_deleted_main_thing =false;
          }
   
        })     
   }


      } catch (error) {
       console.log(error) 
      }


// then going into the folder to delete all the other files there
  
   if(_deleted_file_in_there !== undefined){
    //  then we are going to delete one by one
     _deleted_file_in_there.forEach(element=>{
        // finding the index there and the taking it out 
         
           let index_now_here  = proto_now._arraypp.findIndex(item => item.name === element);
            if(index_now_here !== -1){
            proto_now._arraypp.splice(index_now_here,1);
       delete_file("./public/pp",element);
           }
          
     })
   }

  
  //  here we are going to be  gathering the element in the file section of the thing 
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
  
    //   
    console.log("there is a new file");
    console.log(the_file_we_are_going_with);
    // here is setting the thing into the array 
    the_file_we_are_going_with.forEach(element=>{
      proto_now._arraypp.push(element)    
    })
   

      if(is_deleted_main_thing){
         console.log("firts element deleted")
          // then suing the first elemetn of the array there
           proto_now.pp = proto_now._arraypp[0].name
      }

       try {
        await proto_now.save()
       } catch (error) {
        console.log(error)
       }
    

          //  sending back to the same proto
     res.redirect(`/prototype/one_now/?proto_id=${Proto_id}`)
     
 })




settingRouter.post("/Noti_setting",async(req,res)=>{  
   if(req.user_now){
      let {fault_noti_radio,comment_noti_radio} = req.body
    //   then going there and chaning the feature of the
    //   the getEmail_falut and others
      req.user_Now.getEmail_falut = fault_noti_radio;
       req.user_Now.getEmail_comment = comment_noti_radio;
        //  saving it 
         await req.user_Now.save();

          console.log(req.user_Now);
           
          res.redirect("/");
   }
})

 
module.exports = settingRouter;