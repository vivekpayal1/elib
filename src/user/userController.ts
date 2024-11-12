import { Request, Response } from "express";

const createUser = async (req: Request, res: Response) => {
  res.json({ message: "User Created" });
};
export { createUser };
