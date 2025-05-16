import { Socket } from "socket.io-client";
import { create } from "zustand";

type UseUserSocketType = {
  socket: Socket | null;
  setSocket: (socketId: Socket | null) => void;
};
export const useUserSocket = create<UseUserSocketType>((set) => ({
  socket: null,
  setSocket: (socketId) => {
    set(() => ({ socket: socketId }));
  },
}));
