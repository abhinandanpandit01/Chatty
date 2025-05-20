export type UserMessage = {
  senderId: string;
  receiverId: string;
  message: string;
  attactments?: string[];
  senderName: string;
  receiverName: string;
  conversationId: string;
  _id: string;
};
