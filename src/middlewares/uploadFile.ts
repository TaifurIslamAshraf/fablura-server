import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

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
      const originalName = file.originalname.replace(/\s+/g, "-");
      const name = Date.now() + "-" + originalName;
      cb(null, name);
    },
  });

  const fileFilters = async (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
    }
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
