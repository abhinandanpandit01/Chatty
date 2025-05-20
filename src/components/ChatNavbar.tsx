import { User } from "@/types/UserTypes";
import { Avatar, AvatarImage } from "./ui/avatar";
import { IoIosArrowBack } from "react-icons/io";
import { useSelectedContactStore } from "@/store/UseSelectedContactStore";
import { useNavigate } from "react-router-dom";
import { useMessagesStore } from "@/store/ChatsStore";
type ChatNavbarProps = {
  contactInfo: User;
};
function ChatNavbar({ contactInfo }: ChatNavbarProps) {
  const clearSelectedContact = useSelectedContactStore(
    (state) => state.clearSelectedContact
  );
  const clearMessages = useMessagesStore((state) => state.clearMessages);

  const navigate = useNavigate();
  const handleBackToChats = () => {
    clearSelectedContact();
    clearMessages();
    navigate("/chat/me/chats");
  };
  return (
    <div className="w-full h-full py-4 pl-2 flex gap-5 border-b-2 items-center">
      <IoIosArrowBack
        className="text-4xl rounded-full p-1"
        onClick={handleBackToChats}
      />
      <Avatar className="w-12 h-12">
        <AvatarImage src={contactInfo.avatarUrl} />
      </Avatar>
      <div className="w-full cursor-pointer">
        <span className="font-semibold text-xl">{contactInfo.fullname}</span>
      </div>
    </div>
  );
}
export default ChatNavbar;
