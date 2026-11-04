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
  },
  role:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;
