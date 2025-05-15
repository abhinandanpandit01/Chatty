import uploadFileToCloud from "../utils/cloudinary";
import { ResponseMessage } from "../utils/responseMessage";
import { Request, Response } from "express";
const uploadImageFile = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files) {
    res
      .status(400)
      .json(new ResponseMessage("Image files are needed", 400, false));
    return;
  }
  try {
    const imageFilesUrl: Array<string> = [];

    for (const file of files) {
      try {
        const { url } = await uploadFileToCloud(file.path, file.mimetype);
        console.log(url);
        imageFilesUrl.push(url);
      } catch (err) {
        console.log("Failed to upload files", err);
        res
          .status(500)
          .json(
            new ResponseMessage("Failed to upload image files", 500, false)
          );
      }
    }
    res.status(201).json(
      new ResponseMessage("Image Uploaded successfully", 201, true, {
        imageFilesUrl,
      })
    );
  } catch (err) {
    res
      .status(500)
      .json(new ResponseMessage("Failed to upload image files", 500, false));
    console.log("Failed to upload image files", err);
  }
};

export { uploadImageFile };
