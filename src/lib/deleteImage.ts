import fs from "fs";
import path from "path";

export const deleteImage = async (filePath: string): Promise<void> => {
  if (!filePath) return;

  const imagePath = path.join(process.cwd(), filePath);

  return new Promise((resolve, reject) => {
    fs.unlink(imagePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          console.log(`File not found: ${imagePath}`);
          resolve(); // Resolve even if file is not found
        } else {
          console.error(`Error deleting file: ${imagePath}`, err);
          reject(err);
        }
      } else {
        console.log(`Successfully deleted file: ${imagePath}`);
        resolve();
      }
    });
  });
};

export const deleteMultipleImages = async (filePaths: string[]): Promise<void> => {
  if (filePaths.length === 0) return;

  const deletePromises = filePaths.map(filePath => deleteImage(filePath));

  try {
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting multiple images:", error);
    throw error; // Rethrow the error if you want to handle it in the calling function
  }
};