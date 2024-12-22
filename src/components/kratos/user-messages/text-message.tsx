import { TextPart } from "ai";
import { FC } from "react";

interface UserMessageProps {
  textPart: TextPart;
}

export const UserMessage: FC<UserMessageProps> = ({ textPart }) => {
  const text = textPart.text;

  return (
    <div className="flex items-center w-full space-x-1 mt-2 min-h-10">
      <div className="text-xl flex-1 break-words w-full">{text}</div>
    </div>
  );
};
