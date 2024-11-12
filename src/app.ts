import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Welcome To Elib Apis" });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
