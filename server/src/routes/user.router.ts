import { Router } from "express";
import {
  authorizeUser,
  fetchUsers,
  getContactListUsers,
  registerSocketId,
  getSocketIds,
} from "../handlers/user.handler";
import { checkIfUserExists } from "../middlewares/auth.middleware";

const router = Router();
router.get("/test", (req, res) => {
  res.send("Only for testing purposes");
});
router.post("/authorize", checkIfUserExists, authorizeUser);
router.post("/user/:userId/registerSocketId", registerSocketId);
router.get("/socketIds", getSocketIds);
router.get("/allUsers", fetchUsers);
router.get("/contactListUsers", getContactListUsers);
export default router;
