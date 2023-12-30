import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

export const fileUploder = (
  destinations: string,
  singleUpload: boolean,
  fieldName: string
) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinations);
    },

    filename: (req, file, cb) => {
      const name = Date.now() + "-" + file.originalname;
      cb(null, name);
    },
  });

  const fileFilters = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedFileType = ["png", "jpeg", "jpg", "webp"];
    const Fileextname = path.extname(file.originalname).substring(1);
    if (!allowedFileType.includes(Fileextname)) {
      cb(new Error("Invalid file type"));
    }
    cb(null, true);
  };

  const upload = singleUpload
    ? multer({
        storage: storage,
        fileFilter: fileFilters,
        limits: { fileSize: 1024 * 1024 * 2 },
      }).single(fieldName)
    : multer({
        storage: storage,
        fileFilter: fileFilters,
        limits: { fileSize: 1024 * 1024 * 2 },
      }).array(fieldName, 5);

  return upload;
};
