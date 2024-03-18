const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;
const validator = require('validator')
const bcrypt = require('bcryptjs');
const { ValidationError } = require("../middleware/Error");

const UserSignupSchema = new mongoose.Schema({
  id: ObjectId,
  username: {
    type: String,
    required: [true, "can't be blank"],
  },
  email: {
    type: String,
    required: [true, "can't be blank"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "can't be blank"],
  },
  cPassword: {
    type: String,
    required: [true, "can't be blank"],
  },
  URLS: [
    {
      type: String,
      ref: "URL",
    },
  ],
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
});

//Hash the plain text password before saving 
UserSignupSchema.pre('save', async function (next){
  const user = this
  if(user.isDirectModified('password')){
      user.password = await bcrypt.hash(user.password,8)
  }
  next()
})

module.exports = mongoose.model("User", UserSignupSchema);
