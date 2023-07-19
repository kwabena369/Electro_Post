
const filter = (req,file,cb) =>{
    let Desire_type = ['jpeg','jpg','png',"mp4"];
      
     let currentfile = String(file.mimetype.split('/')[1]).toLowerCase();
       
     if (Desire_type.includes(currentfile)) {
       cb(null, true);
     } else {
       cb(new Error("There is a different file extension"));
     }
        }

         // here is fpr the section of the filter for the preview
         const Preview_filter = (req,file,cb) =>{
           let Desire_type = ['jpeg','jpg','png',"mp4"];
             
            let currentfile = String(file.mimetype.split('/')[1]).toLowerCase();
              
            if (!Desire_type.includes(currentfile)) {
              cb(null, true);
            } else {
              cb(new Error("There is a different file extension"));
            }
         }


          
         module.exports = {
              imagefilter  : filter,
               filefilter  : Preview_filter
         }