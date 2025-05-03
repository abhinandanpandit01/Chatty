import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { socketFunctions } from "./socket/socket";

const expressServer = express();
expressServer.use(express.json());
expressServer.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const httpServer = createServer(expressServer);
export const socketServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

socketFunctions();

httpServer
  .once("error", (err) => {
    console.log("Failed To Create HTTP Server", err);
  })
  .listen(process.env.SERVER_PORT, () => {
    console.log(`> Server is running on port ${process.env.SERVER_PORT}`);
  });
