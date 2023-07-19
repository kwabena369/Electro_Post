const mongoose = require("mongoose");
const { decrypt_chat, encrypt_chat } = require("../util-staff/chat_encode_decoder");

const CommentSchema = new mongoose.Schema({
  protype_Id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "protypeInfo"
  },
  chat_content: {
    type: String,
    trim: true,
    required: true
  },
  currentUser: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "UserIdentity"
  },
  Of_kind: {
    type: String,
    default: "text"
  },
  Number_Like: {
    type: Number,
    default: 0
  },
  Number_dislike: {
    type: Number,
    default: 0
  },
  People_who_like: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserIdentity"
  }],
  People_who_dislike: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserIdentity"
  }],
  Number_of_sub_comment: {
    type: Number,
    default: 0
  },
  Real_Date_Time: {
    type: String,
    default: function () {
      return new Date().toLocaleString(); // Get the current date and time
    }
  }
}, {
  timestamps: true
});

CommentSchema.pre("save", async function (next) {
  const user_now = this;
  if (user_now.isModified("chat_content")) {
    user_now.chat_content = encrypt_chat(user_now.chat_content);
  }
  next();
});

module.exports = mongoose.model("comment_db", CommentSchema);
