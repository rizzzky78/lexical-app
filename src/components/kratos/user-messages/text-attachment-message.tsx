import { FilePart, ImagePart, TextPart } from "ai";
import { FC } from "react";

interface TextAttachmentMessageProps {
  attachment: (TextPart | ImagePart | FilePart)[];
}

export const TextAttachmentMessage: FC<TextAttachmentMessageProps> = ({
  attachment,
}) => {
  // plain text
  const text = attachment.filter((m) => m.type === "text");
  // base64 content
  const image = attachment.filter((m) => m.type === "image");
  // base 64 content
  const file = attachment.filter((m) => m.type === "file");

  const shape = {
    text: text[0]?.text,
    image: {
      data: image[0]?.image, // base 64
      mime: image[0]?.mimeType,
    },
    file: {
      data: file[0]?.data, // base 64
      mime: file[0]?.mimeType,
    },
  };

  return (
    <div>
      <div>CONTENT HERE</div>
    </div>
  );
};
