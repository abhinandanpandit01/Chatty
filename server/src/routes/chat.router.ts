import { Router } from "express";
import {
  getChatsHandler,
  saveChatsHandler,
} from "../handlers/chats.controller";

const router = Router();
router.get("/allChats/:senderName/:recieverName", getChatsHandler);
router.post("/saveChats/:senderName/:recieverName", saveChatsHandler);
export { router as chatRouter };
