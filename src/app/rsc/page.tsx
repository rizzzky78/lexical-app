import { FC } from "react";
import { v4 } from "uuid";
import { AI } from "@/app/action";
import { Chat } from "@/components/kratos/main/chat";

const ChatPage: FC = () => {
  const id = v4();

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} />
    </AI>
  );
};

export default ChatPage;
