import { User as SelectedContact } from "@/types/UserTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SelectedContactStore = {
  selectedContact: SelectedContact;
  updateSelectedContact: (userInfo: SelectedContact) => void;
};
export const useSelectedContactStore = create<SelectedContactStore>()(
  persist(
    (set) => ({
      selectedContact: { avatarUrl: "", username: "" },
      updateSelectedContact: (userInfo) => {
        set(() => ({ selectedContact: userInfo }));
      },
    }),
    {
      name: "Selected Contact Info",
    }
  )
);
