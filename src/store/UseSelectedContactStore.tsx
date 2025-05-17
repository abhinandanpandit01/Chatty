import { SelectedContact } from "@/types/UserTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SelectedContactStore = {
  selectedContact: SelectedContact;
  updateSelectedContact: (userInfo: SelectedContact) => void;
  clearSelectedContact: () => void;
  updateSelectedContactSocketId: (socketId: string) => void;
};
export const useSelectedContactStore = create<SelectedContactStore>()(
  persist(
    (set, get) => ({
      selectedContact: {
        avatarUrl: "",
        fullname: "",
        _id: "",
        socketId: "",
        status: "offline",
      },
      updateSelectedContact: (userInfo) => {
        set(() => ({ selectedContact: userInfo }));
      },
      clearSelectedContact: () => {
        set(() => ({
          selectedContact: {
            avatarUrl: "",
            fullname: "",
            _id: "",
            socketId: "",
            status: "offline",
          },
        }));
      },
      updateSelectedContactSocketId: (socketId: string) => {
        const newInfo = get().selectedContact;
        newInfo.socketId = socketId;
        set(() => ({ selectedContact: newInfo }));
      },
    }),
    {
      name: "Selected Contact Info",
    }
  )
);
