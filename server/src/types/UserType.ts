import { ConnectionState } from "./ConnectionStateType";

export type User = {
  fullname: string;
  avatarUrl: string;
  _id: string;
  contactList: Array<object>;
  socketId: string;
  status: ConnectionState;
  conversationIds: Record<string, string>;
};
