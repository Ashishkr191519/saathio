import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { acceptFriendRequest, getFriendRequest, getMyFrineds, getOutgoingRequest, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";


const router = express.Router();
//apply protectRoute middleware to all routes first then it goes to other endpoints
router.use(protectRoute);
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFrineds);
router.get("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);
router.get("/friend-requests",getFriendRequest);
router.get("/outgoing-friend-request",getOutgoingRequest);

export default router;
