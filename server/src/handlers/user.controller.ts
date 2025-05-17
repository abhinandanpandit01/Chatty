import { Request, Response } from "express";
import { ResponseMessage } from "../utils/responseMessage";
import { UserModel as User } from "../models/user.model";
import { RequestDetailsType } from "../types/RequestDetailsType";
const authorizeUser = async (req: Request, res: Response) => {
  const { email, fullname, userId, avatarUrl } = req.body;
  if (!(email || fullname || userId || avatarUrl)) {
    res.status(400).json(new ResponseMessage("Insufficient Data", 400, false));
  }
  try {
    const isUserPresent = await User.findById(userId);
    if (isUserPresent)
      res
        .status(400)
        .json(new ResponseMessage("User already Present", 400, true));
    const newUser = await User.create({
      email,
      fullname,
      avatarUrl,
      contactList: [],
      _id: userId,
      conversationIds: {},
      requestedList: [],
      requestList: [],
    });
    res
      .status(201)
      .json(
        new ResponseMessage("User created Successfully", 201, true, newUser)
      );
  } catch (err) {
    console.error("Failed to create User", err);
    res
      .status(500)
      .json(new ResponseMessage("Failed to create new User", 500, false));
  }
};
const fetchUsers = async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    res
      .status(400)
      .json(new ResponseMessage("User id is required", 400, false));
    return;
  }
  try {
    const allUsers = await User.find().limit(15);
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      res.status(404).json(new ResponseMessage("User not found", 404, false));
    }
    const currentUserContactList = currentUser?.contactList as string[];
    if (currentUserContactList.length == 0) {
      const otherUsers = allUsers.map((user) => {
        const plainUser = user.toObject();
        return currentUser?.requestedList?.includes(user.id)
          ? {
              ...plainUser,
              isRequested: true,
            }
          : {
              ...plainUser,
              isRequested: false,
            };
      });
      res.status(200).json(
        new ResponseMessage("Successfully fetched users", 200, true, {
          usersList: otherUsers,
        })
      );
      return;
    } else {
      const otherUsers = allUsers
        .filter((user) => !currentUserContactList.includes(user.id))
        .map((user) => {
          const plainUser = user.toObject();
          return currentUser?.requestedList?.includes(user.id)
            ? {
                ...plainUser,
                isRequested: true,
              }
            : { ...plainUser, isRequested: false };
        });
      res.status(200).json(
        new ResponseMessage("Successfully fetched users", 200, true, {
          usersList: otherUsers,
        })
      );
    }
  } catch (err) {
    console.log("Failed to fetch users", err);
    res
      .status(500)
      .json(new ResponseMessage("Failed to list users", 500, false));
  }
};
const getContactListUsers = async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    res
      .status(400)
      .json(new ResponseMessage("User id is required", 400, false));
    return;
  }
  try {
    const result = await User.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "contactList",
          foreignField: "_id",
          as: "contactListUsers",
        },
      },
      {
        $project: {
          contactListUsers: 1,
          _id: 0,
        },
      },
    ]);
    const contactListUsers =
      result.map((user) => user.contactListUsers)[0] || [];
    res.status(200).json(
      new ResponseMessage("Successfully fetched users", 200, true, {
        contactListUsers,
      })
    );
  } catch (err) {
    console.log("Failed to fetch Contact List Users", err);
    res
      .status(500)
      .json(
        new ResponseMessage("Failed to get contact list users", 500, false)
      );
  }
};
const registerSocketId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    res
      .status(400)
      .json(new ResponseMessage("User Id is required", 400, false));
    return;
  }

  const { socketId } = req.body;
  if (!socketId) {
    res
      .status(400)
      .json(new ResponseMessage("Socket Id is required", 400, false));
    return;
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json(new ResponseMessage("User not found", 404, false));
      return;
    }
    user.socketId = socketId;
    await user.save();

    res
      .status(200)
      .json(
        new ResponseMessage(
          "Successfully registered socket id",
          200,
          true,
          user
        )
      );
  } catch (err) {
    console.log("Failed to register socket id", err);
    res
      .status(500)
      .json(new ResponseMessage("Failed to register socket id", 500, false));
  }
};
const getSocketIds = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.query;
  if (!(senderId || receiverId)) {
    res
      .status(400)
      .json(
        new ResponseMessage("Sender and Receiver id is required", 400, false)
      );
    return;
  }
  try {
    const sender = await User.findById(senderId);
    if (!sender) {
      res.status(404).json(new ResponseMessage("Sender not found", 404, false));
      return;
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res
        .status(404)
        .json(new ResponseMessage("Receiver not found", 404, false));
      return;
    }
    res.status(200).json(
      new ResponseMessage(
        "Successfully fetched sender and receiver socket ids",
        200,
        true,
        {
          senderSocketId: sender.socketId,
          receiverSocketId: receiver.socketId,
        }
      )
    );
  } catch (err) {
    console.log("Failed to fetch sender and receiver socket ids", err);
    res
      .status(500)
      .json(
        new ResponseMessage(
          "Failed to fetch sender and receiver socket ids",
          500,
          false
        )
      );
    return;
  }
};
const sendFriendRequest = async (req: Request, res: Response) => {
  const { requester, accepter } = req.params;
  if (!(requester || accepter)) {
    res
      .status(400)
      .json(
        new ResponseMessage(
          "Both requester and accepter is required",
          400,
          false
        )
      );
    return;
  }
  try {
    const accepterUser = await User.findById(accepter);
    const requesterUser = await User.findById(requester);
    if (!accepterUser) {
      res
        .status(404)
        .json(new ResponseMessage("Accepter user not found", 404, false));
      return;
    }
    if (!requesterUser) {
      res
        .status(404)
        .json(new ResponseMessage("Requested user not found", 404, false));
      return;
    }
    accepterUser.requestList?.push(requester);
    requesterUser.requestedList?.push(accepter);
    await accepterUser.save();
    await requesterUser.save();
    res
      .status(200)
      .json(
        new ResponseMessage(
          `Request sent to ${requesterUser.fullname.split(" ")[0]}`,
          200,
          true
        )
      );
  } catch (err) {
    console.log("Failed to send friend request", err);

    res
      .status(500)
      .json(new ResponseMessage("Failed to send friend request", 500, false));
  }
};
const fetchFriendRequest = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    res
      .status(400)
      .json(new ResponseMessage("User id is required", 400, false));
    return;
  }
  try {
    const currentUser = await User.findById(userId).populate("requestList");
    if (!currentUser) {
      res.status(404).json(new ResponseMessage("User not found", 404, false));
      return;
    }

    const friendRequestList = currentUser?.requestList || [];
    res.status(200).json(
      new ResponseMessage("Successfully fetch request list", 200, true, {
        friendRequestList,
      })
    );
  } catch (err) {
    console.log("Failed to fetch friend requests", err);
    res
      .status(500)
      .json(new ResponseMessage("Failed to fetch friend requests", 500, false));
  }
};
const acceptRejectFriendRequest = async (req: Request, res: Response) => {
  const { type } = req.params;
  const { requestDetails }: { requestDetails: RequestDetailsType } = req.body;
  if (!type) {
    res
      .status(400)
      .json(
        new ResponseMessage("Accept or reject type is required", 400, false)
      );
    return;
  }
  if (!requestDetails) {
    res
      .status(400)
      .json(new ResponseMessage("Request details is required", 400, false));
    return;
  }
  if (type == "accept") {
    const accepterUser = await User.findById(requestDetails.accepterId);
    const senderUser = await User.findById(requestDetails.requesterId);
    if (!accepterUser) {
      res
        .status(404)
        .json(new ResponseMessage("Accepter user not found", 404, false));
      return;
    }
    if (!senderUser) {
      res
        .status(404)
        .json(new ResponseMessage("Requester user not found", 404, false));
      return;
    }
    accepterUser.requestList =
      accepterUser.requestList?.filter(
        (id) => id.toString() !== requestDetails.requesterId.toString()
      ) || [];

    accepterUser.contactList.push(requestDetails.requesterId);

    senderUser.requestedList = senderUser.requestedList?.filter(
      (id) => id.toString() !== requestDetails.accepterId.toString()
    );

    await accepterUser.save();
    await senderUser.save();

    res
      .status(200)
      .json(new ResponseMessage("Accpeted friend request", 200, true));
  } else if (type == "reject") {
    const accepterUser = await User.findById(requestDetails.accepterId);
    const senderUser = await User.findById(requestDetails.requesterId);
    if (!accepterUser) {
      res
        .status(404)
        .json(new ResponseMessage("Accepter user not found", 404, false));
      return;
    }
    if (!senderUser) {
      res
        .status(404)
        .json(new ResponseMessage("Requester user not found", 404, false));
      return;
    }
    accepterUser.requestList?.filter((id) => id !== requestDetails.requesterId);
    senderUser.requestedList?.filter((id) => id !== requestDetails.accepterId);
    await accepterUser.save();
    await senderUser.save();

    res
      .status(200)
      .json(new ResponseMessage("Rejected friend request", 200, true));
  } else {
    res.status(400).json(new ResponseMessage("Wrong mehtod type", 400, false));
  }
};
export {
  authorizeUser,
  fetchUsers,
  getContactListUsers,
  registerSocketId,
  getSocketIds,
  sendFriendRequest,
  fetchFriendRequest,
  acceptRejectFriendRequest,
};
