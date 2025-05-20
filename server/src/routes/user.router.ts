import { Router } from "express";
import {
  authorizeUser,
  fetchUsers,
  getContactListUsers,
  registerSocketId,
  getSocketIds,
  sendFriendRequest,
  fetchFriendRequest,
  acceptRejectFriendRequest,
  fetchAllOnlineUsers,
} from "../handlers/user.controller";
import { checkIfUserExists } from "../middlewares/auth.middleware";

const router = Router();
router.post("/authorize", checkIfUserExists, authorizeUser);
router.post("/user/:userId/registerSocketId", registerSocketId);
router.post("/sendFriendRequest/:requester/:accepter", sendFriendRequest);
router.post("/respondFriendRequest/:type", acceptRejectFriendRequest);
router.get("/socketIds", getSocketIds);
router.get("/allUsers", fetchUsers);
router.get("/contactListUsers", getContactListUsers);
router.get("/friendRequests/:userId", fetchFriendRequest);
router.get("/:userId/onlineUsers", fetchAllOnlineUsers);
export default router;
