type FileData = {
  name: string;
  type: string;
  size: number;
  buffer: string;
};

type FormDataResult = {
  textInputs: Record<string, string>;
  files: FileData[];
};

export async function handleFormInput(
  formData: FormData
): Promise<FormDataResult> {
  const textInputs: Record<string, string> = {};
  const files: FileData[] = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      // Convert the file to a Buffer
      const buffer = await value.arrayBuffer().then((ab) => Buffer.from(ab));

      files.push({
        name: value.name,
        type: value.type,
        size: value.size,
        buffer: buffer.toString("base64").slice(0, 200),
      });
    } else {
      // Handle text input
      textInputs[key] = value.toString();
    }
  }

  console.log(JSON.stringify({ textInputs, files }, null, 2));

  return { textInputs, files };
}
