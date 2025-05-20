import { model, Schema, Document } from "mongoose";

interface IChatSchema extends Document {
  message: string;
  attactments?: File[];
  senderName: string;
  receiverName: string;
  conversationId: string;
  _id: string;
}
const chatSchema = new Schema<IChatSchema>(
  {
    _id: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    attactments: {
      type: Array,
    },
    senderName: {
      type: String,
      required: [true, "Sender name is required"],
    },
    receiverName: {
      type: String,
      required: [true, "Receiver name is required"],
    },
    conversationId: {
      type: String,
      required: [true, "Conversation id is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const chatModel = model<IChatSchema>("Chat", chatSchema);
