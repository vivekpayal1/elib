import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Field Required!");
    return next(error);
  }
  // DB Call
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User Already Exists with this Email");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(400, "Error while getting Error"));
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating User"));
  }

  // Token
  try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });
    res.status(201).json({ accessToken: token });
  } catch (error) {
    next(createHttpError(500, "Error While Sign In"));
  }
};

export { createUser, loginUser };
