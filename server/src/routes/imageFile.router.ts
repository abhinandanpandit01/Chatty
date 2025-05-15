import { Router } from "express";
import { uploadImageFile } from "../handlers/imagefile.controller";

const router = Router();
router.post("/images/postImage", uploadImageFile);
export { router as ImageFileRouter };
