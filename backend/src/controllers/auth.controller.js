// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
// import { upsertStreamUser } from "../db/stream.js";

// // SIGN UP
// export async function signUp(req, res) {
//   const { fullName, email, password, gender, collegeName } = req.body;

//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   try {
//     if (!fullName || !email || !password || !gender || !collegeName) {
//       return res.status(400).json({ message: "Please fill all the fields" });
//     }

//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         message:
//           "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
//       });
//     }

//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         message: "User already exists, please use a different email",
//       });
//     }

//     const idx_public = Math.floor(Math.random() * 100) + 1;
//     const idx_boys = Math.floor(Math.random() * 50) + 1;
//     const idx_girls = Math.floor(Math.random() * 50) + 51;
//     let randomAvatar ;

//     if (gender === "male") {
//       randomAvatar = `https://avatar.iran.liara.run/public/${idx_boys}.png`;
//     } else if (gender === "female") {
//       randomAvatar = `https://avatar.iran.liara.run/public/${idx_girls}.png`;
//     }
//     else {
//       randomAvatar = `https://avatar.iran.liara.run/public/${idx_public}.png`;
//     }

//     const newUser = await User.create({
//       fullName,
//       email,
//       password,
//       gender,
//       collegeName,
//       profilePicture: randomAvatar,
//     });

//     try {
//       await upsertStreamUser({
//         id: newUser._id.toString(),
//         name: newUser.fullName,
//         image: newUser.profilePicture || "",
//       });
//       console.log("Stream user created successfully");
//     } catch (error) {
//       console.error("Error creating Stream user:", error);
//       throw new Error("Failed to create Stream user");
//     }

//     const token = jwt.sign(
//       { userId: newUser._id },
//       process.env.JWT_SECRET_KEY,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.cookie("jwt", token, {
//       httpOnly: true, // This flag helps mitigate the risk of client-side script accessing the protected cookie and prevents XSS attacks.
//       secure: process.env.NODE_ENV === "production", // This flag ensures that the cookie is only sent over HTTPS connections in production and prevents man-in-the-middle attacks.
//       sameSite: "strict", // This flag helps prevent CSRF attacks by ensuring that the cookie is only sent in a first-party context.
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(201).json({
//       message: `User created successfully with email ${email}`,
//     });
//   } catch (error) {
//     console.error("SignUp Error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }

// // SIGN IN
// export async function signIn(req, res) {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Please fill all the fields" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const isPasswordCorrect = await user.comparePassword(password);
//     if (!isPasswordCorrect) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
//       expiresIn: "7d",
//     });

//     res.cookie("jwt", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       success: true,
//       message: `User signed in successfully with email ${email}`,
//     });
//   } catch (error) {
//     console.error("SignIn Error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }

// // SIGN OUT
// export async function signOut(req, res) {
//   res.clearCookie("jwt", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   });

//   res.status(200).json({
//     success: true,
//     message: "User signed out successfully",
//   });
// }

// // TODO: add forgot password functionality
// export async function forgotPassword(req, res) {
//   const { email } = req.body;
//   if (!email) {
//     return res.status(400).json({ message: "Please provide an email" });
//   }

//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const resetToken = jwt.sign(
//     { userId: user._id },
//     process.env.JWT_SECRET_KEY,
//     { expiresIn: "15m" }
//   );
//   const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptioins = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: "Password Reset",
//     text: `Click the link to reset your password: ${resetLink}\n The link will expire in 15 minutes.`,
//   };

//   try {
//     await transporter.sendMail(mailOptioins);
//     return res.status(200).json({
//       message: `Password reset link has been sent to ${email}`,
//     });
//   } catch (error) {
//     console.error("Forgot Password Error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }

// export async function resetPassword(req, res) {
//   const { token, newPassword } = req.body;
//   if (!token || !newPassword) {
//     return res
//       .status(400)
//       .json({ message: "Please provide a token and new password" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     user.password = newPassword;
//     await user.save();
//     return res.status(200).json({ message: "Password reset successfully" });
//   } catch (error) {
//     console.error("Reset Password Error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }

// export async function onBoard(req,res){
  
//   try {
//     const userId = req.user._id;
//     const { fullName, bio, gender, collegeName } = req.body;
//     if (!fullName || !bio || !gender || !collegeName) {
//       return res.status(400).json({ message: "Please fill all the fields" ,
//         missingFields: [
//           !fullName && "fullName",
//           !bio && "bio",
//           !gender && "gender",
//           !collegeName && "collegeName"
//         ].filter(Boolean),

//       }); 
//     }

//     const updateUser = await User.findByIdAndUpdate(userId, {
//       ...req.body,
//       onBoarded: true,
//     }, { new: true });// new: true returns the updated document

//     if (!updateUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     try {
//       await upsertStreamUser({
//         id: updateUser._id.toString(),
//         name: updateUser.fullName,
//         image: updateUser.profilePicture || "",

//       });
//       console.log("Stream user updated successfully");
//     } catch (error) {
//       console.error("Error updating Stream user:", error);
//       throw new Error("Failed to update Stream user");
//     }

//     await upsertStreamUser({
//       id: updateUser._id.toString(),
//       name: updateUser.fullName,
//       image: updateUser.profilePicture || "",
//     });
//     res.status(200).json({  message: "User onBoarded successfully" });
//   } catch (error) {
//     console.error("OnBoard Error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }


import { upsertStreamUser } from "../db/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
    }

    const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}