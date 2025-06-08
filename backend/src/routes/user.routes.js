// import express from 'express';
// import { protectedRoute } from '../middleware/auth.middleware.js';
// import { getRecommendedUsers, getMyFriends, searchUsers } from '../controllers/user.controller.js'; // This line imports the user controller functions from the user.controller.js file located in the controllers directory.
// import { getFriendRequests, acceptFriendRequest, sendFriendRequest, getSentRequests,denyFriendRequest } from '../controllers/user.controller.js'; // This line imports the friend controller functions from the friend.controller.js file located in the controllers directory.

// const router = express.Router(); // This line creates a new instance of an Express router, which is used to define routes for the application.

// router.use(protectedRoute); // This line applies the protectedRoute middleware to all routes defined in this router.

// router.get('/', getRecommendedUsers);
// router.get('/my-friends', getMyFriends);
// router.get('/search', searchUsers);
// // router.get('/search', searchUsers); // This line defines a GET route for the path '/search' and associates it with the searchUsers controller function.
// router.get('/accept-request/:id', acceptFriendRequest);
// router.post('/send-request/:id/', sendFriendRequest);
// router.post('/deny-request/:id', denyFriendRequest);
// router.get('/friend-requests', getFriendRequests);
// router.get('/sent-requests', getSentRequests);

// export default router;

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

export default router;