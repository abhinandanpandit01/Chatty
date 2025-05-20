import { create } from "zustand";
import { persist } from "zustand/middleware";
type UseOlineUsersStore = {
  onlineUsers: string[];
  setOnlineUser: (userId: string) => void;
  setAllOnlineUser: (userIds: string[]) => void;
  removeOnlineUser: (userId: string) => void;
  clearOnlineUsers: () => void;
};

export const useOnlineUsersStore = create<UseOlineUsersStore>()(
  persist(
    (set, get) => ({
      onlineUsers: [],
      setOnlineUser: async (userId) => {
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
      clearOnlineUsers: () => {
        set(() => ({ onlineUsers: [] }));
      },
      setAllOnlineUser: (userIds: string[]) => {
        set(() => ({ onlineUsers: userIds }));
      },
    }),
    {
      name: "online-users",
    }
  )
);
