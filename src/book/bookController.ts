import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const files = req.files as { [fileName: string]: Express.Multer.File[] };

  // Cover Image
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  // File
  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    bookFileName
  );

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-cover",
      format: coverImageMimeType,
    });
    const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: "pdf",
    });

    const newBook = await bookModel.create({
      title,
      genre,
      author: "673360f493189bcfa88383f6",
      coverImage: uploadResult.secure_url,
      file: bookFileUpload.secure_url,
    });

    // Delete Temp Files
    console.log("filePath", filePath);
    console.log(bookFilePath);
    try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      console.log(error);
    }

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while uploading files!"));
  }
};
export { createBook };
