import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

// Create Book
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const files = req.files as { [fileName: string]: Express.Multer.File[] };

  try {
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    // Upload files to Cloudinary
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

    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUpload.secure_url,
    });

    // Delete Temp Files
    try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      console.error("Error deleting temporary files:", error);
    }

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    console.error("Error during book creation:", error);
    next(createHttpError(500, "Error while uploading files!"));
  }
};
// Upadate Single BOkk
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  try {
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book Not Found"));
    }

    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "Unauthorized"));
    }

    const files = req.files as { [fileName: string]: Express.Multer.File[] };
    let completeCoverImage = book.coverImage;
    let completeFileName = book.file;

    if (files.coverImage) {
      const fileName = files.coverImage[0].filename;
      const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
      );

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: "book-cover",
        format: coverImageMimeType,
      });

      completeCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    if (files.file) {
      const bookFileName = files.file[0].filename;
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        bookFileName
      );

      const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      });

      completeFileName = uploadResultPdf.secure_url;
      await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: bookId },
      {
        title,
        genre,
        coverImage: completeCoverImage,
        file: completeFileName,
      },
      { new: true }
    );

    res.json(updatedBook);
  } catch (error) {
    console.error("Error during book update:", error);
    next(createHttpError(500, "Error while updating book!"));
  }
};
// Get All Book List
const bookList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find();
    if (books.length === 0) {
      next(createHttpError(400, "No Books Found"));
    }
    res.status(200).json(books);
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Error While Getting book List"));
  }
};
// Get Single Book
const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(400, "Book not found"));
    }
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
    return next(createHttpError(400, "Error Getting Book"));
  }
};

// Delete Book
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  try {
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(400, "Book not found"));
    }
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "Unauthorized"));
    }
    const coverFileSplit = book.coverImage.split("/");
    const coverImagePublicId =
      coverFileSplit.at(-2) + "/" + coverFileSplit.at(-1)?.split(".");
    const bookFileSplit = book.file.split("/");
    const bookFilePublicId = bookFileSplit.at(-2) + "/" + bookFileSplit.at(-1);
    await cloudinary.uploader.destroy(coverImagePublicId);
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: "raw",
    });
    await bookModel.deleteOne({ _id: bookId });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
  }
};
export { createBook, updateBook, bookList, getSingleBook, deleteBook };
