import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/HomePage";
import RootLayout from "./layouts/RootLayout";
import ChatPage from "./pages/ChatPage";
import ChatLayout from "./layouts/ChatLayout";
import Chat from "./components/Chat";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useUserSocket } from "./store/UseSocketStore";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/chat/me",
        element: <ChatLayout />,
        children: [
          {
            path: "chats",
            element: <ChatPage />,
          },
        ],
      },
      {
        path: "/chat/:username",
        element: <Chat />,
      },
    ],
  },
]);
function App() {
  const setSocket = useUserSocket((state) => state.setSocket);
  useEffect(() => {
    const socket = io("http://localhost:8000");
    setSocket(socket);
    socket.on("connect", () => {});
    return () => {
      socket.disconnect();
    };
  }, [setSocket]);
  return <RouterProvider router={router} />;
}
export default App;
