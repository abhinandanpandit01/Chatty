import { ClerkLoaded, UserButton } from "@clerk/clerk-react";
import { TbMessageCircleFilled } from "react-icons/tb";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Tabs = "Chats";
enum TabsPath {
  Chats = "/chat/me/chats",
}
export default function ChatPageNavbar() {
  const url = useLocation();
  const [selectedTab, setSelectedTab] = useState<Tabs>(
    url.pathname == TabsPath.Chats ? "Chats" : "Chats"
  );
  const navigate = useNavigate();
  const handleTabSwitch = () => {
    setSelectedTab("Chats");
    navigate("chats");
  };
  return (
    <div className="w-full py-3 px-5 bg-neutral-800 flex items-center justify-between">
      <div className="">
        <span
          className="flex flex-col gap-0.5 items-center justify-center text-xs cursor-pointer"
          onClick={handleTabSwitch}
        >
          {selectedTab == "Chats" ? (
            <TbMessageCircleFilled size={30} />
          ) : (
            <TbMessageCircle size={30} className="contrast-50" />
          )}
          <span
            className={`${
              selectedTab == "Chats" ? "font-semibold" : "contrast-50"
            }`}
          >
            Chats
          </span>
        </span>
      </div>
      <div className="flex items-center gap-5 w-20 mr-5">
        <button
          className="rounded-full bg-indigo-500 text-white p-2
      "
        >
          <FaPlus className="text-xl" />
        </button>
        <ClerkLoaded>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "!w-12 !h-12 bg-red-500",
              },
            }}
          />
        </ClerkLoaded>
      </div>
    </div>
  );
}
