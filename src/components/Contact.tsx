import { Avatar, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSelectedContactStore } from "@/store/UseSelectedContactStore";
import { SelectedContact, User } from "@/types/UserTypes";

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
      className="w-full flex gap-5 items-center"
      onClick={() => {
        const newContact: SelectedContact = {
          fullname: userInfo.fullname,
          avatarUrl: userInfo.avatarUrl,
          _id: userInfo._id,
          socketId: userInfo.socketId,
        };
        updateContact(newContact);
      }}
    >
      <Avatar className="w-12 h-12">
        <AvatarImage src={userInfo.avatarUrl} />
      </Avatar>
      <div
        className="w-full border-b-2 cursor-pointer py-4 "
        onClick={() => navigate(`/chat/${userInfo.fullname}`)}
      >
        <span className="font-semibold text-xl">{userInfo.fullname}</span>
      </div>
    </div>
  );
}
export default Contact;
