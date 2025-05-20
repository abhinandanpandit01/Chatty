import Contact from "./Contact";
import { useEffect, useState } from "react";
import { User } from "@/types/UserTypes";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Loader from "./Loader";
import { useUserSocket } from "@/store/UseSocketStore";
import { ConnectionState } from "../types/ConnectionState";
import { useOnlineUsersStore } from "@/store/UseOnlineUsersStore";
function Contacts() {
  const [users, setUsers] = useState<Array<User>>([]);
  const onlineUsers = useOnlineUsersStore((state) => state.onlineUsers);
  const setOnlineUser = useOnlineUsersStore((state) => state.setOnlineUser);
  const removeOnlineUser = useOnlineUsersStore(
    (state) => state.removeOnlineUser
  );
  const { user: currentUser } = useUser();
  const [loading, setLoading] = useState(false);
  const socket = useUserSocket((state) => state.socket);
  const setAllOnlineUser = useOnlineUsersStore(
    (state) => state.setAllOnlineUser
  );
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/users/contactListUsers?userId=${currentUser?.id}`
      )
      .then((res) => {
        setUsers(res.data.data.contactListUsers);
      })
      .catch((err) => {
        console.log("Failed to fetch users", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUser?.id, socket]);
  useEffect(() => {
    if (!currentUser?.id || !socket) return;
    socket.emit("send_connection_status", {
      status: "online",
      userId: currentUser.id,
    });
    const handleStatus = (connectionData: {
      status: ConnectionState;
      userId: string;
    }) => {
      if (connectionData.status === "online") {
        setOnlineUser(connectionData.userId);
      } else {
        removeOnlineUser(connectionData.userId);
      }
    };

    socket.on("get_connection_status", handleStatus);
    const handleBeforeUnload = () => {
      socket.emit("send_connection_status", {
        userId: currentUser.id,
        status: "offline",
      });
      removeOnlineUser(currentUser.id);
      socket.disconnect();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("get_connection_status", handleStatus);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    currentUser?.id,
    socket,
    removeOnlineUser,
    setAllOnlineUser,
    setOnlineUser,
  ]);
  return (
    <div className="h-[75vh] flex flex-col px-8 overflow-y-scroll gap-3 pt-5 pb-5">
      {loading ? (
        <Loader />
      ) : users.length ? (
        users.map((user) => (
          <Contact
            key={user._id}
            userInfo={user}
            isOnline={onlineUsers.includes(user._id)}
          />
        ))
      ) : null}
    </div>
  );
}
export default Contacts;
