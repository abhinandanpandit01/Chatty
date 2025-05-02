import { Avatar, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSelectedContactStore } from "@/store/UseSelectedContactStore";
import { User } from "@/types/UserTypes";

type ContactProps = {
  userInfo: User;
};
function Contact({ userInfo }: ContactProps) {
  const navigate = useNavigate();
  const updateContact = useSelectedContactStore(
    (state) => state.updateSelectedContact
  );
  return (
    <div
      className="w-full flex gap-5"
      onClick={() => {
        const newContact: User = {
          username: userInfo.username,
          avatarUrl: userInfo.avatarUrl,
        };
        updateContact(newContact);
      }}
    >
      <Avatar className="w-20 h-20">
        <AvatarImage src={userInfo.avatarUrl} />
      </Avatar>
      <div
        className="w-full border-b-2 cursor-pointer py-4 "
        onClick={() => navigate(`/chat/${userInfo.username}`)}
      >
        <span className="font-semibold text-xl">{userInfo.username}</span>
      </div>
    </div>
  );
}
export default Contact;
