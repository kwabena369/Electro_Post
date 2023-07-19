/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./Ghost/*.jpg",
  "./views/*.ejs",
  "./views/Hope_nugget/*.ejs", 
 "./views/Electro-Post/User_Own/*.ejs",
  "./views/layouts/*.ejs",
  "./views/Electro-Post/Prototype/*.ejs",
  "./views/Electro-Post/Question_/*.ejs",
  "./views/Electro-Post/Notification/*.ejs",
  "./views/Electro-Post/Profile_View/*.ejs",
  "./views/Electro-Post/*.ejs"],
  theme: {

      screens: {
           'small'  : {"max": "700px"},
            'larger' : {"min" : "700px"}
      }
     ,
    extend: {
     
      backgroundImage: {
        'custom': "url(Ghost.jpg)",
      },
      height : {
         "full2" : "100vh",
         "wrapper" : "440px",
          
      },
      width : {
        "smpart" : "30%",
         "larger" : "560px"
     }

    },
  },
  plugins: [],
}

