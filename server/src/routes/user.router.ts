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
} from "../handlers/user.handler";
import { checkIfUserExists } from "../middlewares/auth.middleware";

const router = Router();
router.get("/test", (req, res) => {
  res.send("Only for testing purposes");
});
router.post("/authorize", checkIfUserExists, authorizeUser);
router.post("/user/:userId/registerSocketId", registerSocketId);
router.post("/sendFriendRequest/:requester/:accepter", sendFriendRequest);
router.post("/respondFriendRequest/:type", acceptRejectFriendRequest);
router.get("/socketIds", getSocketIds);
router.get("/allUsers", fetchUsers);
router.get("/contactListUsers", getContactListUsers);
router.get("/friendRequests/:userId", fetchFriendRequest);
export default router;
