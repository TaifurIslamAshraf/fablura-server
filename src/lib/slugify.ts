export const slugify = (str: string) => {
  return str
    .replace(/[^\u0980-\u09FFa-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLocaleLowerCase();
};
