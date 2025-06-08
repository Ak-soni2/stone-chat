// import express from 'express'; 
// import { signIn,signUp,signOut,forgotPassword,onBoard, resetPassword } from '../controllers/auth.controller.js';
// import { protectedRoute } from '../middleware/auth.middleware.js'; // This line imports the protectedRoute middleware function from the auth.middleware.js file located in the middleware directory.

// const router =  express.Router(); // This line creates a new instance of an Express router, which is used to define routes for the application.

// router.post('/sign-in', signIn); // This line defines a GET route for the path '/sign-in' and associates it with the signIn controller function.
// router.post('/sign-up', signUp);  // post methods are used to change the server state and these all teh changing the server state
// router.post('/sign-out', signOut); 
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', protectedRoute, resetPassword); // This line defines a POST route for the path '/reset-password' and associates it with the resetPassword controller function, ensuring that the user is authenticated via the protectedRoute middleware.
// router.post('/onboarded', protectedRoute, onBoard); // This line defines a POST route for the path '/onboard' and associates it with the onBoard controller function.
// router.get('/me', protectedRoute, (req, res) => {
//   res.status(200).json({ user: req.user });
// });

// export default router;

import express from "express";
import { login, logout, onboard, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;