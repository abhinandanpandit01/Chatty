import { users } from "@/constants/DummyUsersList";
import Contact from "./Contact";

function Contacts() {
  return (
    <div className="h-[75vh] flex flex-col px-8 overflow-y-scroll gap-3 pt-5">
      {users.map((user) => (
        <Contact key={user.id} userInfo={user} />
      ))}
    </div>
  );
}
export default Contacts;
