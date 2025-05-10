import { model, Schema, Document } from "mongoose";
interface IUserSchema extends Document {
  fullname: string;
  email: string;
  avatarUrl: string;
  contactList: [string];
  requestList?: [string];
  _id: string;
  conversationIds: Map<string, string>;
  socketId: string;
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
    },
  ],
  socketId: {
    type: String,
    default: "",
  },
});

export const UserModel = model<IUserSchema>("User", UserSchema);
