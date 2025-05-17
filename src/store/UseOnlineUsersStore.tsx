import { create } from "zustand";
import { persist } from "zustand/middleware";
type UseOlineUsersStore = {
  onlineUsers: string[];
  setOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
};

export const UseOlineUsersStore = create<UseOlineUsersStore>()(
  persist(
    (set, get) => ({
      onlineUsers: [],
      setOnlineUser: (userId) => {
        const current = get().onlineUsers;
        if (!current.includes(userId)) {
          set({ onlineUsers: [...current, userId] });
        }
      },
      removeOnlineUser: (userId) => {
        const previousUserIds = get().onlineUsers;
        const updatedUserIds = previousUserIds.filter((id) => id !== userId);
        set(() => ({ onlineUsers: updatedUserIds }));
      },
    }),
    {
      name: "online-users",
    }
  )
);
