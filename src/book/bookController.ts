import { Request, Response } from "express";
const createBook = (req: Request, res: Response) => {
  console.log(req.file);
  console.log("files", req.files);
  res.json({});
};
export { createBook };
