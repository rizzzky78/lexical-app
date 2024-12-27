import { FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { AI } from "../(server-action)/action-single";

export const maxDuration = 60;

const ChatPage: FC = () => {
  const id = uuidv4();

  return (
    // <AI initialAIState={{ chatId: id, messages: [] }}>
    //   <Chat id={id} />
    // </AI>
    <div>NOT PRESERVED</div>
  );
};

export default ChatPage;
