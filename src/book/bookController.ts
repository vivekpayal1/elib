import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";

const createBook = async (req: Request, res: Response) => {
  const files = req.files as { [fileName: string]: Express.Multer.File[] };
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );
  console.log("🚀 ~ createBook ~ filePath:", filePath);

  const upload = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
    folder: "book-cover",
    format: coverImageMimeType,
  });
  console.log("🚀 ~ createBook ~ upload:", upload);

  res.json({});
};
export { createBook };
