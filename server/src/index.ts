import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { socketFunctions } from "./socket/socket";
import userRouter from "./routes/user.router";
import mongoose from "mongoose";
import { chatRouter } from "./routes/chat.router";
import { ImageFileRouter } from "./routes/imageFile.router";
import { upload } from "./middlewares/multer.middleware";
const expressServer = express();
expressServer.use(express.json());
expressServer.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.0.122:5173"],
    credentials: true,
  })
);
mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => {
    console.log("> Connected to MongoDB ⚙️");
  })
  .catch((err) => {
    console.log("Failed to connect to db", err);
  });
const httpServer = createServer(expressServer);
export const socketServer = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.0.122:5173"],
    credentials: true,
  },
});

socketFunctions();
expressServer.use("/users", userRouter);
expressServer.use("/chats", chatRouter);
expressServer.use("/files", upload.array("images", 10), ImageFileRouter);
httpServer
  .once("error", (err) => {
    console.log("Failed To Create HTTP Server", err);
  })
  .listen(process.env.SERVER_PORT, () => {
    console.log(`> Server is running on port ${process.env.SERVER_PORT}`);
  });
