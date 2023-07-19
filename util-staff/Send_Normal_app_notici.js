//  that in place of the system of ghost 

 const axios = require("axios");
 
// for the in build notification
 
//  noti db
 const noti_DB = require("../model/Notification")
 
 async function send_Noticification(user_ID,post_ID){
   //  for the making  of the axios get request
  try{
    
    let golden = await axios.get(`http://localhost:3000/n/comment_o_p`,{
   params:{
        user_id : user_ID,
        post_id : post_ID
    }
  })
    if(golden){
       console.log("Good to go")
    }

 
}catch{
    console.log("could not do the fetching")
  }

   
 }



//    fetching the notifcation number
 async  function getNoticationNum(user_now){
  // finding the real person there
      let all_with_N_C_number = 
       await noti_DB.count({"Status":"N_C",'currentUser':user_now});
        return  all_with_N_C_number;
      }
      module.exports= {
    send_noti : send_Noticification,
     get_Number :  getNoticationNum
      }
       