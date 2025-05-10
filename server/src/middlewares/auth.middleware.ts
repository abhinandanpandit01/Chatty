import { Request, Response, NextFunction } from "express";
import { ResponseMessage } from "../utils/responseMessage";
import { UserModel as User } from "../models/user.model";

const checkIfUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, fullname, avatarUrl } = req.body;
  if (!email || !fullname || !avatarUrl) {
    res.status(400).json(new ResponseMessage("Insufficient data", 400, false));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res
      .status(409)
      .json(new ResponseMessage("User already registered", 409, false));
    return;
  }

  next(); // Proceed to register
};

export { checkIfUserExists };
