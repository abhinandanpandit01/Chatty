import ChatPageNavbar from "@/components/ChatPageNavbar";
import { Loader } from "lucide-react";
import { Outlet, useNavigation } from "react-router-dom";

function ChatLayout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";
  return (
    <div className="w-full h-full relative">
      {isNavigating && <Loader />}
      <ChatPageNavbar />
      <Outlet />
    </div>
  );
}
export default ChatLayout;
