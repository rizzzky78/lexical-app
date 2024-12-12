import { TextPart } from "ai";
import { FC } from "react";

interface TextMessageProps {
  textPart: TextPart;
}

export const TextMessage: FC<TextMessageProps> = ({ textPart }) => {
  return (
    <div>
      <p>{textPart.text}</p>
    </div>
  );
};
