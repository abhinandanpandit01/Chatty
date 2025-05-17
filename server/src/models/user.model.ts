import { model, Schema, Document } from "mongoose";
interface IUserSchema extends Document {
  fullname: string;
  email: string;
  avatarUrl: string;
  contactList: string[];
  requestList: string[];
  requestedList: string[];
  _id: string;
  conversationIds: Map<string, string>;
  socketId: string;
  status: "online" | "offline";
}
const UserSchema = new Schema<IUserSchema>({
  _id: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: [true, "Full name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  avatarUrl: {
    type: String,
    default: "../assets/user.png",
  },
  conversationIds: {
    type: Map,
    of: String,
    required: true,
    default: {},
  },
  contactList: [
    {
      type: String,
      ref: "User",
      required: true,
    },
  ],
  requestList: [
    {
      type: String,
      ref: "User",
      required: true,
    },
  ],
  socketId: {
    type: String,
    default: "",
  },
  requestedList: [
    {
      type: String,
      ref: "User",
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
});

export const UserModel = model<IUserSchema>("User", UserSchema);
