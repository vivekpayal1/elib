import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Field Required!");
    return next(error);
  }
  // DB Call
  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "User Already Exists with this Email");
    return next(error);
  }
  res.json({ message: "User Created" });
};
export { createUser };
