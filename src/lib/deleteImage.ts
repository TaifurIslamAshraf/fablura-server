import fs from "fs/promises";

export const deleteImage = async (filePath: string) => {
  if (filePath) {
    await fs.unlink(filePath);
  }
};

export const deleteMultipleImages = async (filePaths: string[]) => {
  if (filePaths.length > 0) {
    const unlinkPromises: Promise<void>[] = [];
    filePaths.map((file) => {
      const unlinkPromis = fs.unlink(file);
      unlinkPromises.push(unlinkPromis);
    });

    await Promise.all(unlinkPromises);
  }
};
