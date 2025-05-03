import { useSelectedContactStore } from "@/store/UseSelectedContactStore";
import ChatNavbar from "./ChatNavbar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizontal, SmilePlus } from "lucide-react";
import { socket } from "@/App";
import { useEffect, useState } from "react";
import { UserMessage } from "../../server/types/MessageTypes";
import { useMessagesStore } from "@/store/Chats";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
function Chat() {
  const messages = useMessagesStore((state) => state.messages);
  const updateMessages = useMessagesStore((state) => state.updateMessages);
  const contactInfo = useSelectedContactStore((state) => state.selectedContact);
  const url = useLocation();
  const recieverName = url.pathname.split("/")[2];
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const { user: currentUser } = useUser();
  const handleSendMessage = async () => {
    const new_message: UserMessage = {
      senderId: socket.id as string,
      recieverId: "",
      message: message,
      senderName: currentUser?.fullName as string,
      recieverName: recieverName as string,
    };
    socket.emit("send_message", new_message);
    updateMessages(new_message);
    setMessage("");
  };

  useEffect(() => {
    const handleReceive = (recieved_msg: UserMessage) => {
      updateMessages(recieved_msg);
    };

    socket.on("recieve_message", handleReceive);

    return () => {
      socket.off("recieve_message", handleReceive);
    };
  }, []);

  return (
    <div className="h-screen grid grid-cols-1 grid-rows-[5rem_1fr_5rem]">
      <ChatNavbar contactInfo={contactInfo} />
      <div className="chat-container bg-sky-400">
        {messages.map((chat) => (
          <div
            className={`chat ${
              chat.senderName == currentUser?.fullName
                ? "chat-end"
                : "chat-start"
            }`}
            key={chat.message}
          >
            <div className="chat-bubble font-medium">{chat.message}</div>
          </div>
        ))}
      </div>
      <div className="w-full flex items-center px-5 gap-5 mt-1 relative">
        <Input
          className="w-full py-6 rounded-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type..."
        />
        <Button className="rounded-full" onClick={() => setOpen(!open)}>
          <SmilePlus />
        </Button>
        <Button className="rounded-full">
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
export default Chat;
