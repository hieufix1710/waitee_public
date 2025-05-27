export const urlForAttachment = (blobPath: string) => {
  return `${process.env.NEXT_PUBLIC_STORAGE_HOST}${blobPath}`;
};
