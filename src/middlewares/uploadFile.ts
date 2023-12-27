import multer from "multer";

export const fileUploder = (destinations: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinations);
    },

    filename: (req, file, cb) => {
      const name = Date.now() + "-" + file.originalname;
      cb(null, name);
    },
  });

  return multer({ storage: storage });
};
