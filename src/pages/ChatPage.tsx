import Contacts from "@/components/Contacts";
import { useSelectedContactStore } from "@/store/UseSelectedContactStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useMessagesStore } from "@/store/ChatsStore";
import { useUserSocket } from "@/store/UseSocketStore";

function ChatPage() {
  const selectedContact = useSelectedContactStore(
    (state) => state.selectedContact
  );
  const clearMessages = useMessagesStore((state) => state.clearMessages);
  const clearSelectedContact = useSelectedContactStore(
    (state) => state.clearSelectedContact
  );
  const socket = useUserSocket((state) => state.socket);
  const { user: currentUser } = useUser();
  useEffect(() => {
    if (!currentUser) return;
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
  }, [currentUser]);
  useEffect(() => {
    if (!currentUser?.id) return;
    axios.post(
      `http://localhost:8000/users/user/${currentUser?.id}/registerSocketId`,
      {
        socketId: socket?.id,
      }
    );
  }, [currentUser?.id, socket]);
  useEffect(() => {
    clearMessages();
    clearSelectedContact();
  }, [clearMessages, clearSelectedContact]);
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
