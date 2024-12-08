import React from "react";

type UserMessageProps = {
  message: string;
};

export const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className="flex flex-row-reverse py-2">
      <div className="max-w-xl">
        <div className="text-sm flex-1 break-words text-white bg-[#343131] rounded-lg w-fit px-4 py-3">
          {message}
        </div>
      </div>
    </div>
  );
};
