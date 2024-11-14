import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import { createBook } from "./book/bookController";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome To Elib Apis" });
});

app.use("/api/users", userRouter);

// Book Routes 
app.use("/api/books", createBook);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
