import { Avatar, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSelectedContactStore } from "@/store/UseSelectedContactStore";
import { SelectedContact, User } from "@/types/UserTypes";

type ContactProps = {
  userInfo: User;
  isOnline: boolean;
};
function Contact({ userInfo, isOnline }: ContactProps) {
  const navigate = useNavigate();
  const updateContact = useSelectedContactStore(
    (state) => state.updateSelectedContact
  );
  const status = isOnline;
  return (
    <div
      className="w-full flex gap-5 items-center"
      onClick={() => {
        const newContact: SelectedContact = {
          fullname: userInfo.fullname,
          avatarUrl: userInfo.avatarUrl,
          _id: userInfo._id,
          socketId: userInfo.socketId,
          status: userInfo.status,
        };
        updateContact(newContact);
      }}
    >
      <div className="indicator">
        <span
          className={`indicator-item ${status ? "status" : ""} status-success`}
        ></span>
        <div className="grid place-items-center">
          <Avatar className="w-12 h-12">
            <AvatarImage src={userInfo.avatarUrl} />
          </Avatar>
        </div>
      </div>
      <div
        className="w-full border-b-2 cursor-pointer py-4 flex flex-col"
        onClick={() => navigate(`/chat/${userInfo.fullname}`)}
      >
        <span className="font-semibold text-xl">{userInfo.fullname}</span>
        <span className="text-xs font-bold text-neutral-400">
          {status ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
}
export default Contact;
