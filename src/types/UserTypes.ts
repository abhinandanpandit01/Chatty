export type User = {
  fullname: string;
  avatarUrl: string;
  _id: string;
  contactList?: Array<object>;
  socketId?: string;
};

export type SelectedContact = User;
