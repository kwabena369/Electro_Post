

//  settingRouter.post("/edited_fault_file",uploader.array("fault_files",3),async(req,res)=>{

//    console.log(req.body)
//   let standing_array=[];
//   let no_d = false
//     if(req.body.staff !==null ){  
//                      // the undeleted array 
//     standing_array = req.body.staff.split(",");
//      // remaking the standing 
//       standing_array = standing_array.map(element=>{
//        return  {
//        name : element
//       }
//      }) 
//     }


  


//   let proto_now = await fault_db.findOne({_id : req.body.staff2})
 
//        //  getting theo old array
// let the_pp_array = await proto_now._arraypp;

// if(!no_d){ 
// //  the  container here id the checking of the othere set where there
// //  is nothing

// let current_working = [];

// if(the_pp_array.length !== 0){


// //  bring out array which were deleted
//  current_working = the_pp_array.filter(element =>
//  !standing_array.some(
//    obj => obj.name.includes(element.name) ||
//     element.name.includes(obj.name)
//  )
// );
  


// //  deleting them
// current_working.forEach(element  =>{
//  delete_file("./public/fault_pp",element.name,res);
// })
// }else if(standing_array.length === 0){
//  // but if it is then we are dealing with 
//  //  two thing either --- there person has 
//  //  deleted all--
// // delete the pp[one]

// delete_file("./public/fault_pp",proto_now.pp)
// }


// let only_name=[];
//    //  for the once which get unloadde
//   if(req.files.length !== 0){
//      only_name =  req.files.map(element=>{
//      return  {
//      name : element.filename
//              //  consoleloging the other
//     }
              
//    }) 
//  }
 

//  let f_array =[];
//        if(standing_array === null){
//    f_array   = only_name
//        }else{
//         f_array = only_name.concat(standing_array)
//        }



//        //  sentizing of the array  
//         f_array = f_array.filter(element =>{
//           return element.name !== ''
//         })


//        // for the setting the firtst preview
//        console.log(f_array);
//         proto_now.pp = f_array[0].name;
//        proto_now._arraypp = f_array
//        //  myTSL.setIntegrationTime( t ) 

// }
//      //  saving the old thing 
//  proto_now.discribe_falut = req.body.descriptionPrototype
//      await proto_now.save()
             


//      //  sending back to the same proto
// res.redirect(`/question/one_now_fault/?fault_id=${req.body.staff2}`)

// })


//  router for the save of the notification setting


// <small class="absolute w-6 h-6 rounded-full 
// left-0 top-0 p-1
//  text-xs bg-red-600 text-white
//  box-border
//   text-center">
//   <% if ( typeof Number_Notification !== null && 
//        typeof Number_Notification !== 'undefined'){ %>
//     <%= Number_Notification %>
//     <% } %>
     
   
//     </small>