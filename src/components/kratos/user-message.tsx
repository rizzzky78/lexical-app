/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/ui/card";
import { MessageProperty } from "@/lib/types/ai";
import { CoreUserMessage, FilePart, ImagePart, TextPart } from "ai";

interface UserMessageProps {
  message: CoreUserMessage;
}

export default function UserMessage({ message }: UserMessageProps) {
  const renderContent = (content: TextPart | ImagePart | FilePart) => {
    switch (content.type) {
      case "text":
        return <p className="text-sm">{content.text}</p>;
      case "image":
        return (
          <img
            src={content.image as string}
            alt="User attachment"
            className="max-w-full h-auto rounded-lg"
          />
        );
      case "file":
        return <p className="text-sm">File: NAME</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-end">
      <Card className="bg-[#FFF0DC] text-[#343131] p-3 rounded-full max-w-[80%]">
        {Array.isArray(message.content)
          ? message.content.map((content, index) => (
              <div key={index} className="mb-2 last:mb-0">
                {renderContent(content)}
              </div>
            ))
          : renderContent({ type: "text", text: message.content })}
      </Card>
    </div>
  );
}
