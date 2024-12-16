"use client";

import { handleFormInput } from "@/lib/agents/action/form-service";
import { storageService } from "@/lib/agents/action/storage-service";

export default function UploadForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const res = await handleFormInput(formData);
    const data = await storageService.processFormData(formData)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Enter your name" />
      <input type="file" name="documents" multiple />
      <button type="submit">Submit</button>
    </form>
  );
}
