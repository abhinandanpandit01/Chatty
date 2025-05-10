export type UserMessage = {
  senderId: string;
  receiverId: string;
  message: string;
  attactments?: File[];
  senderName: string;
  receiverName: string;
  conversationId: string;
  _id?: string;
};
