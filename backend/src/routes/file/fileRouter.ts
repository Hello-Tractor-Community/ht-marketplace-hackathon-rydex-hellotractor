import { Router } from "express";
import multer from "multer";
import validateUser from "../../middleware/validateUser";
import { getStorage } from "firebase-admin/storage";
import { v4 } from "uuid";
import { FileItem } from "../../models/Product";
import { ApiError } from "../../utils/errors";

const fileRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

fileRouter.post(
  "/",
  validateUser,
  upload.single("file"),
  async (req, res, next) => {
    try {
      const id = v4();
      const file = req.file;

      if (!file) {
        throw new ApiError(400, "File is required");
      }

      const cloudFile = getStorage().bucket().file(`files/${id}`);
      await cloudFile.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      await cloudFile.makePublic();

      const url = cloudFile.publicUrl();

      res.json({
        id,
        url,
        uploadedOn: new Date(),
        mimeType: file.mimetype,
      } as FileItem);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default fileRouter;
