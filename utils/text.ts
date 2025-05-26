export const urlForAttachment = (blobPath: string) => {
  return `${process.env.NEXT_PUBLIC_API_HOST}${blobPath}`;
};
