import { useSelectedContactStore } from "@/store/UseSelectedContactStore";
import ChatNavbar from "./ChatNavbar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizontal, SmilePlus } from "lucide-react";
// import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { Chats } from "@/constants/DemoChats";
function Chat() {
  const contactInfo = useSelectedContactStore((state) => state.selectedContact);
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="h-screen grid grid-cols-1 grid-rows-[5rem_1fr_5rem]">
      <ChatNavbar contactInfo={contactInfo} />
      <div className="chat-container bg-sky-400">
        {Chats.map((chat, idx) => (
          <div className={`chat ${idx % 2 == 0 ? "chat-start" : "chat-end"}`}>
            <div className="chat-bubble font-medium">{chat.message}</div>
          </div>
        ))}
      </div>
      <div className="w-full flex items-center px-5 gap-5 mt-1 relative">
        <Input className="w-full py-6 rounded-full" />
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
