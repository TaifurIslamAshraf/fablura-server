import fs from "fs/promises";

export const deleteImage = async (filePath: string) => {
  if (filePath) {
    await fs.unlink(filePath);
  }
};
