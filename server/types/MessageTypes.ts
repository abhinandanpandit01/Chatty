export type UserMessage = {
  senderId: string;
  recieverId: string;
  message: string;
  attactments?: File[];
};
