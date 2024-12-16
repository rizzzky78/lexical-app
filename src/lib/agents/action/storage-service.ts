interface TextEntry {
  key: string;
  value: string;
}

interface FileEntry {
  key: string;
  mime?: string;
  buffer: Buffer;
  base64: string;
}

interface ProcessedFormData {
  textEntries: TextEntry[];
  filesEntries: FileEntry[];
}

class StorageService {
  /**
   * Processes FormData with comprehensive error handling
   * @param formData - The FormData to process
   * @returns Processed form data with text and file entries
   */
  async processFormData(formData: FormData): Promise<ProcessedFormData> {
    const textEntries: TextEntry[] = [];
    const filesEntries: FileEntry[] = [];
    const errors: Error[] = [];

    for (const [key, value] of Array.from(formData.entries())) {
      try {
        // Validate text entries
        if (typeof value === "string") {
          if (value.trim() === "") {
            throw new Error("Empty string value");
          }

          textEntries.push({
            key,
            value: value.trim(),
          });
        }

        // Process file entries
        if (value instanceof File && value.size > 0) {
          // Additional file validation
          if (!value.type) {
            throw new Error("File without MIME type");
          }

          const buffer = Buffer.from(await value.arrayBuffer());

          filesEntries.push({
            key,
            buffer,
            base64: buffer.toString("base64"),
          });
        }
      } catch (error) {
        // Collect errors without interrupting processing
        errors.push(
          error instanceof Error
            ? error
            : new Error(`Unexpected error processing ${key}`)
        );
      }
    }

    // Optional: Log collected errors
    if (errors.length > 0) {
      console.warn("Form data processing encountered errors:", errors);
    }

    const payload = {
      textEntries,
      filesEntries: filesEntries.map((v) => ({
        key: v.key,
        base64: v.base64.slice(0, 200),
      })),
    };

    console.log(payload);

    return {
      textEntries,
      filesEntries,
    };
  }
}

export const storageService = new StorageService();
