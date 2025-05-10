import { Router } from "express";
import { getChatsHandler, saveChatsHandler } from "../handlers/chats.handler";

const router = Router();
router.get("/test", (req, res) => {
  res.send("Only testing purpose");
});
router.get("/allChats/:senderName/:recieverName", getChatsHandler);
router.post("/saveChats/:senderName/:recieverName", saveChatsHandler);
export { router as chatRouter };
