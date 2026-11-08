const mongoose = require("mongoose");
const Role = require("./Role")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email:{
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  profileImg: { 
    type: String, 
    default: '/uploads/users/default-avatar.png' 
  },
  role:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;
