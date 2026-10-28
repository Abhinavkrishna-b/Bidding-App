import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import multer from "multer";
import { uploadsDirectory } from "../utils/imageStorage.js";

const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_request, _file, callback) => {
      fs.mkdir(uploadsDirectory, { recursive: true })
        .then(() => callback(null, uploadsDirectory))
        .catch(callback);
    },
    filename: (_request, file, callback) => {
      callback(null, `${randomUUID()}${allowedImageTypes.get(file.mimetype)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (_request, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      const error = new Error("Only JPG, PNG, and WebP images are allowed.");
      error.statusCode = 400;
      callback(error);
      return;
    }
    callback(null, true);
  },
});

function handleUpload(middleware) {
  return (request, response, next) => {
    middleware(request, response, (error) => {
      if (error instanceof multer.MulterError) {
        error.statusCode = 400;
      }
      next(error);
    });
  };
}

export const uploadAuctionImages = handleUpload(upload.array("images", 5));
export const uploadReplacementImage = handleUpload(upload.single("image"));
