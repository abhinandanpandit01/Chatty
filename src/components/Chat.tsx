import { useSelectedContactStore } from "@/store/UseSelectedContactStore";
import ChatNavbar from "./ChatNavbar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizontal, SmilePlus } from "lucide-react";
import { socket } from "@/App";
import { useEffect, useRef, useState } from "react";
import { UserMessage } from "../../server/src/types/MessageTypes";
import { useMessagesStore } from "@/store/ChatsStore";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
function Chat() {
  const messages = useMessagesStore((state) => state.messages);
  const updateMessages = useMessagesStore((state) => state.updateMessages);
  const contactInfo = useSelectedContactStore((state) => state.selectedContact);
  const loadChatOnVist = useMessagesStore((state) => state.loadChatOnVisit);
  const updateSelectedContactSocketId = useSelectedContactStore(
    (state) => state.updateSelectedContactSocketId
  );
  const url = useLocation();
  const recieverName = url.pathname.split("/")[2];
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const { user: currentUser } = useUser();
  const bottomRef = useRef<HTMLDivElement>(null);
  const handleSendMessage = async () => {
    const new_message: UserMessage = {
      senderId: socket.id as string,
      receiverId: contactInfo.socketId as string,
      message: message,
      senderName: currentUser?.fullName as string,
      receiverName: recieverName as string,
      conversationId: "",
    };
    socket.emit("send_message", new_message);
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
  }, [updateMessages]);
  useEffect(() => {
    loadChatOnVist(currentUser?.fullName as string, contactInfo.fullname);
  }, [loadChatOnVist, contactInfo.fullname, currentUser?.fullName]);
  useEffect(() => {
    if (!currentUser?.id) return;
    axios.post(
      `http://localhost:8000/users/user/${currentUser.id}/registerSocketId`,
      {
        socketId: socket.id,
      }
    );
    axios
      .get(
        `http://localhost:8000/users/socketIds?senderId=${currentUser.id}&receiverId=${contactInfo._id}`
      )
      .then((res) => {
        const { receiverSocketId } = res.data.data;
        updateSelectedContactSocketId(receiverSocketId);
      })
      .catch((err) => {
        console.log("Failed to fetch socket ids", err);
      });
  }, [currentUser?.id, contactInfo._id, updateSelectedContactSocketId]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  if (!currentUser) return;
  return (
    <div className="h-screen grid grid-cols-1 grid-rows-[5rem_1fr_5rem]">
      <ChatNavbar contactInfo={contactInfo} />
      <div className="bg-sky-400 overflow-y-scroll" id="chat-container">
        {messages.length
          ? messages.map((chat) => (
              <div
                className={`chat ${
                  chat.senderName == currentUser.fullName
                    ? "chat-end"
                    : "chat-start"
                }`}
                key={chat.message}
              >
                <div className="chat-bubble font-medium">{chat.message}</div>
              </div>
            ))
          : null}
        <div ref={bottomRef} />
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
