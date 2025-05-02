import Contacts from "@/components/Contacts";
import Search from "@/components/Search";
import { useSelectedContactStore } from "@/store/UseSelectedContactStore";
import { Outlet } from "react-router-dom";

function ChatPage() {
  const selectedContact = useSelectedContactStore(
    (state) => state.selectedContact
  );
  console.log(selectedContact);
  return (
    <div>
      {selectedContact.username !== "" ? (
        <Outlet />
      ) : (
        <>
          <header className="px-5">
            <h1 className="md:text-5xl text-3xl font-bold py-2 px-3 md:mb-3 mb-1">
              Chats
            </h1>
            <Search />
          </header>
          <Contacts />
        </>
      )}
    </div>
  );
}
export default ChatPage;
