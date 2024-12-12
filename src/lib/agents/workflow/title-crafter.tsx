import { MessageProperty } from "@/lib/types/ai";
import logger from "@/lib/utility/logger/root";
import { google } from "@ai-sdk/google";
import { CoreUserMessage, generateText } from "ai";

type TitleCrafterPayload = {
  context: MessageProperty[];
};

export async function titleCrafter({ context }: TitleCrafterPayload) {
  const [user, assistant] = context;

  let fallbackTitle: string = "";

  if (Array.isArray(user.content)) {
    const filteredMessage = user.content.filter((m) => m.type === "text");
    fallbackTitle = filteredMessage[0].text.substring(0, 100) || "Untitled";
  }

  const ctx = {
    userContext: Array.isArray(user.content)
      ? user.content.filter((m) => m.type === "text")
      : fallbackTitle,
    assistantContext: Array.isArray(assistant.content)
      ? assistant.content.filter((m) => m.type === "text")
      : fallbackTitle,
  };

  let generatedTitle: string = "";

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: "",
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: JSON.stringify(ctx) }],
        },
      ],
    });

    generatedTitle = text;
  } catch (error) {
    console.error(error);
    logger.error(`An Error occured when generating chat title!`);

    generatedTitle = fallbackTitle;
  }

  return generatedTitle;
}
