export const getImagePath = (fileName: string) => {
  return fileName ? `http://localhost:3333/images/${fileName}` : undefined;
};
