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

  const fileFilters = async (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedFileType = ["png", "jpeg", "jpg", "webp"];
    const Fileextname = path.extname(file.originalname).substring(1);
    const isFileSizeAllowed = file.size <= 2 * 1024 * 1024;
    const isFileTypeAllowed = allowedFileType.includes(Fileextname);

    if (!isFileTypeAllowed) {
      cb(new Error("Invalid file type"));
    } else if (!isFileSizeAllowed) {
      cb(new Error("File size exceeds the limit"));
    } else {
      cb(null, true);
    }

    cb(null, true);
  };

  const upload = singleUpload
    ? multer({
        fileFilter: fileFilters,
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 2 },
      }).single(fieldName)
    : multer({
        fileFilter: fileFilters,
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 2 },
      }).array(fieldName, 5);

  return upload;
};
