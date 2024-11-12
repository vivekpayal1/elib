import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Welcome To Elib Apis" });
});

export default app;
