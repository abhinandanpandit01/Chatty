import { UserMessage } from "server/src/types/MessageTypes";
import { persist } from "zustand/middleware";
import { create } from "zustand";
import axios from "axios";

type Messages = UserMessage[];

type MessagesStore = {
  messages: Messages;
  updateMessages: (message: UserMessage, role?: "receiver" | "sender") => void;
  clearMessages: () => void;
  loadChatOnVisit: (currentUserName: string, contactName: string) => void;
};

export const useMessagesStore = create<MessagesStore>()(
  persist(
    (set) => ({
      messages: [],
      updateMessages: async (message, role) => {
        if (role == "receiver") {
          set((state) => ({ messages: [...state.messages, message] }));
          return;
        }
        try {
          const res = await axios.post(
            `http://localhost:8000/chats/saveChats/${message.senderName}/${message.receiverName}`,
            {
              message: {
                message: message.message,
                senderName: message.senderName,
                receiverName: message.receiverName,
              },
            }
          );
          set((state) => ({ messages: [...state.messages, res.data.data] }));
        } catch (err) {
          console.error("Failed to save message", err);
        }
      },
      clearMessages: () => {
        set({ messages: [] });
      },
      loadChatOnVisit: async (currentUserName, contactName) => {
        try {
          const res = await axios.get(
            `http://localhost:8000/chats/allChats/${currentUserName}/${contactName}`
          );
          set({ messages: res.data.data });
        } catch (err) {
          console.error("Failed to load contact's chat", err);
        }
      },
    }),
    {
      name: "messages-store",
    }
  )
);
