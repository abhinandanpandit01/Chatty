import { UserMessage } from "../types/MessageTypes.ts";
import { socketServer } from "../index.ts";
import { ConnectionState } from "../types/ConnectionStateType.ts";
import { UserModel as User } from "../models/user.model.ts";
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
    socket.on(
      "send_connection_status",
      async ({
        status,
        userId,
      }: {
        status: ConnectionState;
        userId: string;
      }) => {
        try {
          const user = await User.findById(userId);
          if (!user) {
            console.log("User not found");
            return;
          }
          user.status = status;
          await user.save();
        } catch (err) {
          console.log("Failed to find the user", err);
          return;
        }
        socketServer.emit("get_connection_status", { status, userId });
      }
    );
    socket.on("disconnect", () => {
      console.log(`Socket Id ${socket.id} disconnected`);
    });
  });
};
export { socketId };
