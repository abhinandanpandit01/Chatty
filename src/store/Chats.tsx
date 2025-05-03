import { UserMessage } from "server/types/MessageTypes";
import { persist } from "zustand/middleware";
import { create } from "zustand";
type Messages = UserMessage[];

type MessagesStore = {
  messages: Messages;
  updateMessages: (message: UserMessage) => void;
};

export const useMessagesStore = create<MessagesStore>()(
  persist(
    (set, get) => ({
      messages: [],
      updateMessages: (message) =>
        set({ messages: [...get().messages, message] }),
    }),
    {
      name: "Messages Store",
    }
  )
);
