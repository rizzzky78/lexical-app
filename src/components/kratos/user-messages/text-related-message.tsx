import { FC } from "react";

interface TextRelatedMessageProps {
  query: string;
}

export const TextRelatedMessage: FC<TextRelatedMessageProps> = ({ query }) => {
  return (
    <div>
      <div>{query}</div>
    </div>
  );
};
