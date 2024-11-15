import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import { config } from "./config/config";

const app = express();
// Cors Config
app.use(
  cors({
    origin: config.frontendDomain,
  })
);
// For Parse Incoming Req 
app.use(express.json());

// Home Route 
app.get("/", (req, res) => {
  res.json({ message: "Welcome To Elib Apis" });
});

// User Route 
app.use("/api/users", userRouter);

// Book Routes
app.use("/api/books", bookRouter);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
