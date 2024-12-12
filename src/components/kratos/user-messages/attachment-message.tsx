import { FilePart, ImagePart } from "ai";
import { FC } from "react";

interface AttachmentMessageProps {
  attachment: (ImagePart | FilePart)[];
}

export const AttachmentMessage: FC<AttachmentMessageProps> = ({
  attachment,
}) => {
  return (
    <div>
      <div>CONTENT</div>
    </div>
  );
};
