// import express from "express";
// import { getStreamToken } from "../controllers/chat.controller.js";
// import { protectedRoute } from "../middleware/auth.middleware.js";


// const router = express.Router();

// router.get("/token", protectedRoute, getStreamToken);

// export default router;

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.Controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);

export default router;