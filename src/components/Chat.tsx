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
import EmojiPicker from "emoji-picker-react";
import { BsFillImageFill } from "react-icons/bs";
import axios from "axios";
import FileUploadDialogue from "./FileUploadDialogue";
import { PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
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
  const fileUploadModalRef = useRef<HTMLDialogElement>(null);
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
    if (!socket.id) return;
    const handleReceive = (recieved_msg: UserMessage) => {
      updateMessages(
        recieved_msg,
        recieved_msg.senderId == socket.id ? "sender" : "receiver"
      );
    };
    socket.on("recieve_message", handleReceive);
    return () => {
      socket.off("recieve_message", handleReceive);
    };
  }, [updateMessages]);
  console.log(messages);
  useEffect(() => {
    loadChatOnVist(currentUser?.fullName as string, contactInfo.fullname);
  }, [loadChatOnVist, contactInfo.fullname, currentUser?.fullName]);
  useEffect(() => {
    if (!currentUser?.id || !contactInfo._id) return;
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
                key={chat._id}
                className={`chat ${
                  chat.senderName == currentUser.fullName
                    ? "chat-end"
                    : "chat-start"
                }`}
              >
                <div className="chat-bubble font-medium h-fit">
                  {chat.message !== ""
                    ? chat.message
                    : chat.attactments?.map((url) => (
                        <PhotoView src={url}>
                          <img
                            src={url}
                            alt=""
                            className="md:w-[20rem] w-[12rem]"
                          />
                        </PhotoView>
                      ))}
                </div>
              </div>
            ))
          : null}
        <div ref={bottomRef} />
      </div>
      <div className="w-full flex items-center px-5 gap-5 mt-1 relative">
        <Button
          className="rounded-full py-5"
          onClick={() => fileUploadModalRef.current?.showModal()}
        >
          <BsFillImageFill />
        </Button>
        <FileUploadDialogue modelRef={fileUploadModalRef} />
        <Input
          className="w-full py-6 rounded-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleSendMessage();
              setOpen(false);
            }
          }}
          placeholder="Type..."
        />
        <Button className="rounded-full" onClick={() => setOpen(!open)}>
          <SmilePlus />
        </Button>
        <div className="absolute bottom-[4rem] right-[5rem]">
          <EmojiPicker
            open={open}
            onEmojiClick={(emojiData) => {
              setMessage((e) => (e += emojiData.emoji));
            }}
          />
        </div>
        <Button className="rounded-full">
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
export default Chat;
