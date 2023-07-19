
let the_input_file  = document.getElementById("image_file")
//  this is the function for the  current previewing of file
async function Preview_file(context,fault_id){
     let allowed_files = ["jpeg","png","jpg","pdf"]
      let parent_element = document.querySelector(".dispaly_commnet")
      let Warm_span =document.createElement("span");
 
//   for the design and other
     let Colour = "border-green-300"
    
        let filelist = context
         for (let i = 0; i < filelist.length; i++) {
        let file = filelist[i];
         let ultimateReader = new FileReader();
          // for the image
          let image_to_display = new Image();
 ultimateReader.addEventListener("load",() => {
  if(!allowed_files.includes(file.type)){
    Warm_span.classList.toggle("hidden");
   Colour = "border-red-300"

    //  this is the end of the beginng in the land of tjhe sea
     
     setTimeout(()=>{
      Warm_span.classList.toggle("hidden");
     },2000)
      
      
  }else{
    Colour = "border-green-300"
  }
    let classstaff = ``;
  let  div1 = document.createElement("div");
    div1.classList.add(
      "image-wrapper",
      "relative",
              "w-24",
              "h-42",
              "m-23",
              "flex",
              "flex-wrap",
      "border-solid",
      "border-4",
      "rounded-md",
       "p-14",
       Colour,
      "overflow-hidden"
    );
  let  div2 = document.createElement("div");
    div2.classList.add(
      "preview-cancel",
      "absolute",
      "cursor-pointer",
      "hover:text-red-800",
      "duration-150",
      "right-0",
      "top-0",
      "text-sm",
      "p-1",
      "font-semibold",
      "bg-black",
      "text-center",
      "rounded-bl-md"
    );
    div2.innerText = "X";
  
  
     
  div2.addEventListener("click",() => {
      let Xparent = div1.parentNode;
      Xparent.removeChild(div1)                /// remove the element
    });   
  
    image_to_display.classList.add("image-container", "h-32", "w-full");
     image_to_display.alt = "No image"
    div1.appendChild(image_to_display);
    div1.appendChild(div2);
    parent_element.appendChild(div1);
    scrol_btn();
    image_to_display.src = ultimateReader.result;
     console.log(parent_element);
//  when there is the appening
//  then send to the specific room



     
     
//  make notice that file is there
   });
  //  check_normal(themainWrapper);
  ultimateReader.readAsDataURL(file);
  }
  
  

        //  here is for the other function 
        // for the sending of the info
        
        const formData = new FormData();
formData.append("file", the_input_file.files[0]);


fetch(`/comment_now/image/${fault_id}`, {
  method: "POST",
  body: formData,
   headers :{
   }
})
  .then(response => {
    // Handle the response
  })
  .catch(error => {
    // Handle any errors
  });

   
  }