import fs from "fs";
import path from "path";

export const deleteImage = async (filePath: string) => {
  if (filePath) {
    return new Promise((resolve, reject) => {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        filePath.replace(/\\/g, "/")
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          if (err.code === "ENOENT") {
            console.log("File not found");
          } else {
            console.log(`Error Deleting file: ${filePath}`, err);
          }
        }
      });
      resolve({});
    });
  }
};

export const deleteMultipleImages = async (filePaths: string[]) => {
  if (filePaths.length > 0) {
    const unlinkPromises: Promise<void>[] = [];

    filePaths.map((file) => {
      const unlinkPromise = new Promise<void>((resolve) => {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          file.replace(/\\/g, "/")
        );
        console.log(filePath);
        fs.unlink(filePath, (err) => {
          if (err && err.code === "ENOENT") {
            console.log(`File not found ${file}`);
          } else if (err) {
            console.error(err);
          } else {
            resolve();
          }
        });
      });

      unlinkPromises.push(unlinkPromise);
    });

    await Promise.all(unlinkPromises);
  }
};
