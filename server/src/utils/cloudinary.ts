import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ResponseMessage } from "./responseMessage";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadFileToCloud = async (
  pathName: string,
  fileType: string
): Promise<{
  url: string;
  type: string;
}> => {
  const resourceType = fileType.startsWith("image") ? "image" : "raw";
  if (!pathName) throw new ResponseMessage("Please upload a file", 400, false);
  try {
    const result = await cloudinary.uploader.upload(pathName, {
      resource_type: resourceType,
      access_mode: "public",
    });
    // fs.unlinkSync(pathName);
    return {
      url: result.url,
      type: result.resource_type,
    };
  } catch {
    fs.unlinkSync(pathName);
    throw new ResponseMessage("Failed to upload file", 500, false);
  }
};

export default uploadFileToCloud;
