import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/HomePage";
import RootLayout from "./layouts/RootLayout";
import SignInPage from "./pages/SignInPage";
import ChatPage from "./pages/ChatPage";
import ChatLayout from "./layouts/ChatLayout";
import Chat from "./components/Chat";

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
  return <RouterProvider router={router} />;
}
export default App;
