import { FC } from "react";

interface UserAnswerMessageProps {
  choices: string[];
}

export const UserAnswerMessage: FC<UserAnswerMessageProps> = ({ choices }) => {
  return (
    <div>
      <div>CONTENT</div>
    </div>
  );
};
