import { Request, Response } from "express";
import { ResponseMessage } from "../utils/responseMessage";
import { UserModel as User } from "../models/user.model";
import { chatModel as Chat } from "../models/chat.model";
import { v4 as uuid } from "uuid";
const saveChatsHandler = async (req: Request, res: Response) => {
  const { senderName, recieverName } = req.params;
  const { message } = req.body;
  if (!(senderName || recieverName)) {
    res
      .status(400)
      .json(
        new ResponseMessage("Sendername & Recievername is required", 400, false)
      );
    return;
  }
  if (!message) {
    res
      .status(400)
      .json(new ResponseMessage("Message is required", 400, false));
    return;
  }
  const conversationId = uuid();
  try {
    const sender = await User.findOne({ fullname: senderName });
    const reciever = await User.findOne({ fullname: recieverName });

    if (!sender || !reciever) {
      res
        .status(404)
        .json(
          new ResponseMessage(
            "Sendername & Recievername is not found",
            404,
            false
          )
        );
      return;
    }
    const conversationIdKey = `${senderName.replace(
      /\s+/g,
      "_"
    )}-${recieverName.replace(/\s+/g, "_")}`;
    const conversationIdKey2 = `${recieverName.replace(
      /\s+/g,
      "_"
    )}-${senderName.replace(/\s+/g, "_")}`;
    const isConversationIdKeyPresentSender =
      sender.conversationIds.get(conversationIdKey) == undefined;
    const isConversationIdKeyPresentSender2 =
      sender.conversationIds.get(conversationIdKey2) == undefined;

    const isConversationIdKeyPresentReciever =
      reciever.conversationIds.get(conversationIdKey) == undefined;
    const isConversationIdKeyPresentReciever2 =
      reciever.conversationIds.get(conversationIdKey2) == undefined;
    if (isConversationIdKeyPresentSender && isConversationIdKeyPresentSender2) {
      sender.conversationIds.set(conversationIdKey, conversationId);
    }
    if (
      isConversationIdKeyPresentReciever &&
      isConversationIdKeyPresentReciever2
    ) {
      reciever.conversationIds.set(conversationIdKey, conversationId);
    }
    await sender.save();
    await reciever.save();
    const chatConversationId =
      sender.conversationIds.get(conversationIdKey) ||
      sender.conversationIds.get(conversationIdKey2);
    const newChat = await Chat.create({
      ...message,
      conversationId: chatConversationId,
    });
    res
      .status(201)
      .json(new ResponseMessage("New chat created", 201, true, newChat));
  } catch (err) {
    console.log("Failed to create chat", err);
    res
      .status(500)
      .json(new ResponseMessage("Failed to create chat", 500, false));
  }
};
const getChatsHandler = async (req: Request, res: Response) => {
  const { senderName, recieverName } = req.params;
  if (!(senderName || recieverName)) {
    res
      .status(400)
      .json(
        new ResponseMessage(
          "Sender name and receiver name are required",
          400,
          false
        )
      );
    return;
  }
  try {
    const user = await User.findOne({ fullname: senderName });
    if (!user) {
      res.status(404).json(new ResponseMessage("User not found", 404, false));
      return;
    }
    const conversationId1 = user.conversationIds.get(
      `${senderName.replace(/\s+/g, "_")}-${recieverName.replace(/\s+/g, "_")}`
    );
    const conversationId2 = user.conversationIds.get(
      `${recieverName.replace(/\s+/g, "_")}-${senderName.replace(/\s+/g, "_")}`
    );

    if (!(conversationId1 || conversationId2)) {
      res.status(404);
      return;
    }
    if (conversationId1) {
      const allChat =
        (await Chat.find({ conversationId: conversationId1 })) || [];
      res
        .status(200)
        .json(
          new ResponseMessage(
            "Successfully fetched all chats",
            200,
            true,
            allChat
          )
        );
      return;
    } else {
      const allChat =
        (await Chat.find({ conversationId: conversationId2 })) || [];
      res
        .status(200)
        .json(
          new ResponseMessage(
            "Successfully fetched all chats",
            200,
            true,
            allChat
          )
        );
      return;
    }
  } catch (err) {
    console.log("Failed to fetch chat", err);
    res
      .status(500)
      .json(new ResponseMessage("Failed to fetch new messages", 500, false));
  }
};
export { saveChatsHandler, getChatsHandler };
