const crypto = require("crypto");
// const key = new Uint8Array(Buffer.from("ghostwinter", "utf8"), 0, 32);

const key = "ghostwinter"; // Your desired key
const hashedKey = crypto.createHash("sha256").update(key).digest();
const truncatedKey = hashedKey.slice(0, 32); // Truncate the hashed key to the desired length

const getMeToken = () => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc",truncatedKey, iv);
  const token = {
    value: crypto.randomBytes(10).toString("hex"),
    expirytime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  const encryptedToken =
    cipher.update(JSON.stringify(token), "utf8", "hex") + cipher.final("hex");
  const finalEncrypt = encryptedToken + iv.toString("hex");
  return finalEncrypt;
};

const verifyToken = (value) => {
  const iv = Buffer.from(value.slice(-32), "hex");
  const encryptedData = value.slice(0, -32);
  try {
    const decipher = crypto.createDecipheriv("aes-256-cbc",truncatedKey, iv);
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
};