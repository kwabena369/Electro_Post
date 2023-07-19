// for  the ran gen of the handle 
 const crypto = require("crypto");
 const useridentity = require("../model/UserIdentity");
    // for the 2 Byte
   function Gen_handle(firstN,LastName){ 
    
     const randByte = crypto.randomBytes(2).readUInt16BE(0)%1000;
       let value  = randByte.toString().padStart(3,"0");
     const Array_Handle = [
          `@${firstN}_${LastName}${value}`,
          `@_${firstN}_${LastName}${value}`,
          `@${firstN}${LastName}_${value}`
                         ];
                         let ans=0;   
             Array_Handle.forEach( async(element) => {
                            if(await useridentity.findOne({Userhandle  :element})){
                                 ans+=1
                              }else{
                                ans=0;
                              }
                            }); 
             while (ans !== 0) {
                 Gen_handle(firstN,LastName);
             }    
             
               return Array_Handle
 }
  
  
  module.exports = {
      gen_handle : Gen_handle
  }
  


  

                         