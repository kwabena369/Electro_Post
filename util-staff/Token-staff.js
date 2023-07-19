
const crypto = require("crypto")
const jwt  = require("jsonwebtoken");

  const VeriToken=()=>{ 
     //  Gerating of the token for the user
 const  fourByte = crypto.randomBytes(4);
 let userToken = fourByte.readInt32BE() %10000000;
  return userToken;
  }
 

  //  cookie and other token  

  const CookieToken=(No)=>{
    let  token = jwt.sign({ _id: No}, 'pickthecup',
    {expiresIn:"5d"});
    return token;
  }


//  url token generation function 
 

const generateKey = () => {
  return crypto.randomBytes(32);
};

const getMeToken = () => {
  const key = generateKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const token = {
    value: crypto.randomBytes(20).toString("hex"),
    expirytime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  const encryptedToken =
    cipher.update(JSON.stringify(token), "utf8", "hex") + cipher.final("hex");
  const finalEncrypt = encryptedToken + iv.toString("hex");
  return finalEncrypt;
};

const verifyToken = (value) => {
  const key = generateKey();
  const iv = Buffer.from(value.slice(-32), "hex");
  const encryptedData = value.slice(0, -32);
  try {
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted =
      decipher.update(encryptedData, "hex", "utf8") + decipher.final("utf8");
    try {
      const tokenHere = JSON.parse(decrypted);
      const expiryDate = new Date(tokenHere.expirytime);
      if (expiryDate < new Date()) {
        return "BadLink";
      } else {
        return "GoodLink";
      }
    } catch {
      return "json error";
    }
  } catch (err) {
    console.error("Error verifying token:", err);
    return "Error";
  }
};

module.exports = {
  genToken: getMeToken,
  verifyToken: verifyToken,
    veriToken  :VeriToken,
     cookieToken : CookieToken
};
