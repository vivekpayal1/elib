// Configuration
import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";
cloudinary.config({
  cloud_name: config.cloudinaryCloud,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinarySecretKey,
});
export default cloudinary;
