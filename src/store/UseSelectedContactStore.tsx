import { User as SelectedContact } from "@/types/UserTypes";
import { create } from "zustand";

type SelectedContactStore = {
  selectedContact: SelectedContact;
  updateSelectedContact: (userInfo: SelectedContact) => void;
};
export const useSelectedContactStore = create<SelectedContactStore>((set) => ({
  selectedContact: { avatarUrl: "", username: "" },
  updateSelectedContact: (userInfo) => {
    set(() => ({ selectedContact: userInfo }));
  },
}));
