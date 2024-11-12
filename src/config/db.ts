import mongoose from "mongoose";
import { config } from "./config";

const connetDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("connected Successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Error Connecting", err);
    });
    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.error("Failed to connet DB", error);
    process.exit(1);
  }
};
export default connetDB;
