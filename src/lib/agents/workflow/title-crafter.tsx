import { MessageProperty } from "@/lib/types/ai";
import logger from "@/lib/utility/logger/root";
import { google } from "@ai-sdk/google";
import { CoreUserMessage, generateText } from "ai";

const SYSTEM_INSTRUCTION = `You are a title generation AI assistant. Given a passage of text provided by the user, your task is to compose a concise, attention-grabbing title that accurately reflects the content, with a length between 5 and 8 words. Your title should be informative, engaging, and optimized for web display. Focus on extracting the key themes and ideas from the input text, and craft a title that is both descriptive and compelling. Analyze the user's text for important keywords, central topics, and the overall narrative or message. Use this information to generate a title that is succinct, impactful, and effective at summarizing the core content in an elegant, readable format suitable for web page titles.`;

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
      system: SYSTEM_INSTRUCTION,
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
