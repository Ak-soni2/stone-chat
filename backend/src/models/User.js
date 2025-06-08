// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt'; // bcrypt is a library to help you hash passwords and compare them securely.

// const userSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 8,
//     },
//     gender: {
//         type: String,
//         enum: ['male', 'female', 'other'],
//     },
//     collegeName: {
//         type: String,
//         required: true,
//     },
//     bio:{
//         type: String,
//         default: "Hey there! I am using Stone Chat",
//     },
//     profilePicture: {
//         type: String,
//         default: "https://www.gravatar.com/avatar/?d=mp&f=y",
//     },
//     onBoarded: {
//         type: Boolean,
//         default: false,
//     },
//     friends:[{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//     }],
// }, {timestamps: true});


// // pre hook just before we save the user we have to hash the password
// userSchema.pre('save',async function (next){
    
//     if(!this.isModified('password')){
//         return next();
//     }
    
//     try{
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     }
//     catch(err){
//         next(err);
//     }
// });

// // method to compare password
// userSchema.methods.comparePassword = async function (passwordEntered){
//     try{
//         const isPasswordCorrect = await bcrypt.compare(passwordEntered, this.password);
//         return isPasswordCorrect;
//     }
//     catch(err){
//         throw new Error(err);
//     }
// }
// // such that password should be sent in hashed format
// const User =  mongoose.model('User',userSchema);

// //add college name thing and also add functionality of find by college 
// userSchema.methods.onboarded = function () {
//     return this.onBoarded;
// };

// export default User;

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

export default User;