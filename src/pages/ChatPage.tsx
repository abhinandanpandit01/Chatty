import Contacts from "@/components/Contacts";
import { useSelectedContactStore } from "@/store/UseSelectedContactStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useMessagesStore } from "@/store/ChatsStore";
import { useUserSocket } from "@/store/UseSocketStore";
import { useOnlineUsersStore } from "@/store/UseOnlineUsersStore";
import { User } from "@/types/UserTypes";

function ChatPage() {
  const selectedContact = useSelectedContactStore(
    (state) => state.selectedContact
  );
  const clearMessages = useMessagesStore((state) => state.clearMessages);
  const clearSelectedContact = useSelectedContactStore(
    (state) => state.clearSelectedContact
  );
  const clearOnlineUsers = useOnlineUsersStore(
    (state) => state.clearOnlineUsers
  );
  const setAllOnlineUser = useOnlineUsersStore(
    (state) => state.setAllOnlineUser
  );
  const socket = useUserSocket((state) => state.socket);
  const { user: currentUser } = useUser();
  useEffect(() => {
    if (!currentUser) return;
    axios
      .get(`http://localhost:8000/users/${currentUser.id}/onlineUsers`)
      .then((res) => {
        const onlineContactUsers = res.data.data.onlineContactUsers;
        const onlineContactUsersId = onlineContactUsers.map(
          (user: User) => user._id
        );
        setAllOnlineUser(onlineContactUsersId);
      })
      .catch((err) => {
        console.log("Failed to get all online contact users", err);
      });
    axios
      .post("http://localhost:8000/users/authorize", {
        fullname: currentUser?.fullName,
        email: currentUser?.emailAddresses[0].emailAddress,
        avatarUrl: currentUser?.imageUrl,
        userId: currentUser.id,
      })
      .then(() => {
        location.reload();
      })
      .catch((err) => {
        if (err.status == 409) return;
        console.log("Response Error", err);
      });
    axios.post(
      `http://localhost:8000/users/user/${currentUser?.id}/registerSocketId`,
      {
        socketId: socket?.id,
      }
    );
  }, [currentUser, setAllOnlineUser, socket]);
  useEffect(() => {
    clearMessages();
    clearSelectedContact();
    clearOnlineUsers();
  }, [clearMessages, clearSelectedContact, clearOnlineUsers]);
  return (
    <div>
      {selectedContact.fullname !== "" ? (
        <Outlet />
      ) : (
        <>
          <header className="px-5">
            <h1 className="md:text-5xl text-3xl font-bold py-2 px-3 md:mb-3 mb-1">
              Chats
            </h1>
          </header>
          <Contacts />
        </>
      )}
    </div>
  );
}
export default ChatPage;
