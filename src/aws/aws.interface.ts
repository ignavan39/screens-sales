export interface UploadFileInterface {
  url: string;
  key: string;
}

export interface fileManagerInterface {
  uploadFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<UploadFileInterface>;
  deleteFile(key: string);
}
