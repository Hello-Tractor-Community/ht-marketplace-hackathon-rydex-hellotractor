import apiClient from "./apiClient";

export type FileItem = {
  id: string;
  uploadedOn: Date;
  url: string;
  mimeType?: string;
};

/**
 * Uploads a file to the server.
 *
 * @param file - The file to be uploaded.
 * @returns The URL of the uploaded file.
 */
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<FileItem>("/file", formData);

  return response.data;
};
export default uploadFile;
