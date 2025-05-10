import { UserMessage } from "../types/MessageTypes.ts";
import { socketServer } from "../index.ts";
let socketId: string;
export const socketFunctions = async () => {
  socketServer.on("connection", (socket) => {
    console.log(`Socket Id ${socket.id} is connected`);
    socketId = socket.id;
    // socket workspace
    socket.on("send_message", (message: UserMessage) => {
      socketServer.to(message.receiverId).emit("recieve_message", message);
      socketServer.to(message.senderId).emit("recieve_message", message);
    });
    socket.on("disconnect", () => {
      console.log(`Socket Id ${socket.id} disconnected`);
    });
  });
};
export { socketId };
