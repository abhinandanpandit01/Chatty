import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/HomePage";
import RootLayout from "./layouts/RootLayout";
import SignInPage from "./pages/SignInPage";
import ChatPage from "./pages/ChatPage";
import ChatLayout from "./layouts/ChatLayout";
import Chat from "./components/Chat";
import { useEffect } from "react";
import { io } from "socket.io-client";
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
export const socket = io("http://localhost:8000");
function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket Id", socket.id);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return <RouterProvider router={router} />;
}
export default App;
