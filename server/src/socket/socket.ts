import { UserMessage } from "../../types/MessageTypes.ts";
import { socketServer } from "../index.ts";
export const socketFunctions = async () => {
  socketServer.on("connection", (socket) => {
    console.log(`Socket Id ${socket.id} is connected`);

    // socket workspace
    socket.on("send_message", (message: UserMessage) => {
      console.log("User Message: ", message);
      socket.broadcast.emit("recieve_message", message);
    });
    socket.on("disconnect", () => {
      console.log(`Socket Id ${socket.id} disconnected`);
    });
  });
};
