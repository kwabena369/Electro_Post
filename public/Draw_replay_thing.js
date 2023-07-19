
function comment_thing_area(where_X,where_y,sp_id,of_kind_clicked,type_here){
   //  this is going to be creating the thing
   //  of the comment thing
    let wrapper = document.createElement("div");
      let input_section = document.createElement("div")
       input_section.contentEditable = true
      //   the styling of the input thing 
       input_section.classList.add("outline-none","p-5",
       "the_small_comment","w-full"
       ,"bg-gray-400","rounded-lg","text-2xl")
       wrapper.classList.add(
         "bg-transparent","backdrop-blur-3xl","w-40","h-15","z-50","rounded-lg","p-3","text-center",
     "flex","flex-col","fixed","transform","-translate-x-1/2"
     ,"-translate-y-1/2","items-center","justify-center"
     ,"top-1/2","left-1/2","transform","-translate-x-1/2","-translate-y-1/2");
      // wrapper.style.left = where_X
      // wrapper.style.top = where_y
       
      
   //   here is the btn 
    let span_send = document.createElement("span");
     span_send.innerText = "SEND";
     span_send.classList.add("bg-black",
     "the_small_btn","p-4","cursor-pointer","text-white","rounded-lg","font-sans","text-center")
     //   the appending
    wrapper.appendChild(input_section);
    wrapper.appendChild(span_send)
    document.body.append(wrapper);
//  here is the sending of thing in the system
 span_send.addEventListener("click",()=>{
//   checking wheatehre is not an empty
//  thing there in the system
 let real_staff_here_now = input_section.innerText;
  if(real_staff_here_now !== null){
    //   then we send it to the B.E
     let the_mega_identifier ={
      where_X : where_X,
      where_Y : where_y,
          the_real_deal  : real_staff_here_now,
          pro_id : sp_id,
          type_of  : type_here,
//  specification of the kind of image click  
//   == 
      of_kind  :  of_kind_clicked
     }
      fetch("/snippet_chat/new",{
         headers : {"Content-Type":"application/json"},
          method : 'POST',
          body : JSON.stringify({staff:the_mega_identifier})
      }).then(
         res =>{
          //   then we do make the 
          // thing to appear there
           
 console.log("done in the back")
         }

      )
      overlay12.classList.toggle("hidden");
       document.body.removeChild(wrapper);
  }
 })
    }
 
 function create_One(mama_element,whereX,whereY,sp_id,of_which_image){
    //  for the basic
     let wrapper = document.createElement("span");

      wrapper.classList.add("bg-blue-400","p-2","w-3","h-3","rounded-lg",
      "text-center","absolute","z-50","block");
      //   here we are going to be placing it in right place
      
       wrapper.style.left = ((whereX -mama_element.offsetLeft )/mama_element.offsetWidth )*100+ "%";
       wrapper.style.top = ((whereY - mama_element.offsetTop )/mama_element.offsetHeight)*100+ "%";
        
    //    then we are going to be appending it to the mama element 
    comment_thing_area( wrapper.style.left,wrapper.style.top,sp_id,of_which_image)
     mama_element.appendChild(wrapper)
 }

