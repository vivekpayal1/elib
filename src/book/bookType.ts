import { User } from "../user/userTypes";

export type Book = {
  _id: string;
  title: string;
  author: User;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
};
