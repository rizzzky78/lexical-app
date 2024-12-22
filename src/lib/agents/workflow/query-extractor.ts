import { CoreUserMessage, ImagePart, FilePart } from "ai";
import { fileTypeFromBuffer } from "file-type";
import { storageService } from "../action/storage-service";

export async function queryExtractor(formData: FormData) {
  "use server";

  const payloadContent: CoreUserMessage["content"] = [];
  const { textEntries, filesEntries } = await storageService.processFormData(
    formData
  );

  if (textEntries.length > 0) {
    payloadContent.push({ type: "text", text: textEntries[0].value });
  }

  if (filesEntries.length > 0) {
    // Map to create an array of file processing promises
    const fileProcessingPromises = filesEntries.map(async (v) => {
      const fileType = await fileTypeFromBuffer(v.buffer);
      const isImage = fileType?.mime.startsWith("image/");

      if (isImage) {
        return {
          type: "image",
          image: v.base64,
          mimeType: fileType?.mime,
        } as ImagePart;
      } else {
        return {
          type: "file",
          data: v.base64,
          mimeType: fileType?.mime,
        } as FilePart;
      }
    });

    // Wait for all file processing to complete
    const processedFiles = await Promise.all(fileProcessingPromises);

    payloadContent.push(...processedFiles);
  }

  return { payloadContent };
}
