// here is the thing
//  btn of the like and dislike
 let parent_like_dis  = document.getElementById("parent_like_dis")
  let btn_like = document.getElementById("like_comment");
let btn_disagree = document.getElementById("dis_comment");
 
//  for a hit
 parent_like_dis.addEventListener("click",(event)=>{
      let id_of_hitted = event.target.id
      //  the real deal 
       let deal = id_of_hitted.split("_")[0].replace(/\s/g,'')
    //   here is doing of the fetch to see if it 
    //  a ---new like
    //  a ---- change of decision o like
    //  a ---- rewanting to like again  
     if(deal === "LIKE" || deal === "DISLIKE"){
          fetch(`/comment_now/action/${id_of_hitted}`).then(
             res =>{
                 res.json().then(
                done =>{
if (done.result) {
    console.log("increase the number")
}else{
   console.log("there is no action here");
}              }
                 )
             }
          )
     }
 })