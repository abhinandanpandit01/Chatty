import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/HomePage";
import RootLayout from "./layouts/RootLayout";
import SignInPage from "./pages/SignInPage";
import ChatPage from "./pages/ChatPage";
import ChatLayout from "./layouts/ChatLayout";
import Chat from "./components/Chat";
import { useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useUserSocket } from "./store/UseSocketStore";
axios.defaults.url = "http://localhost:8000";
axios.defaults.withCredentials = true;
// TODO: Fix double chat problem and problem of not recieving chat on the other side live.
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
        path: "/sign-in",
        element: <SignInPage />,
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
  const socket = useUserSocket((state) => state.socket);
  useEffect(() => {
    const socket = io("http://localhost:8000");
    setSocket(socket);
    socket.on("connect", () => {
      console.log("Socket Id", socket.id);
    });
    return () => {
      socket.disconnect();
    };
  }, [setSocket]);
  console.log(socket);
  return <RouterProvider router={router} />;
}
export default App;
