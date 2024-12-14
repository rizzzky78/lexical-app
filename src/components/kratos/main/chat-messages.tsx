interface ChatMessagesProps {
  messages: Array<{ id: string; component: React.ReactNode }>;
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>{message.component}</div>
      ))}
    </>
  );
}
