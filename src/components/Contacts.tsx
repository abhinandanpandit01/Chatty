import Contact from "./Contact";
import { useEffect, useState } from "react";
import { User } from "@/types/UserTypes";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Loader from "./Loader";

function Contacts() {
  const [users, setUsers] = useState<Array<User>>([]);
  const { user: currentUser } = useUser();
  const [loading, setLoading] = useState(false);
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
  }, [currentUser?.id]);
  return (
    <div className="h-[75vh] flex flex-col px-8 overflow-y-scroll gap-3 pt-5 ">
      {loading ? (
        <Loader />
      ) : users.length ? (
        users.map((user) => <Contact key={user._id} userInfo={user} />)
      ) : null}
    </div>
  );
}
export default Contacts;
