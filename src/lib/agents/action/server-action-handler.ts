import { google } from "@ai-sdk/google";
import { CoreMessage, generateId, generateText, TextPart } from "ai";
import { getServerSession, Session } from "next-auth";
import { getChat, saveChat } from "./chat-service";
import {
  AIState,
  ExtendedToolResult,
  MessageProperty,
  MutationPayload,
} from "@/lib/types/ai";
import { _debugHelper } from "@/lib/utility/debug/root";

export const mutateTool = <A = unknown, D = unknown>(
  payload: MutationPayload
) => {
  const { name, args, result } = payload;
  const id = generateId();

  const constructToolResult: ExtendedToolResult<A, D> = {
    success: Boolean(result),
    name,
    args: args as A,
    data: result as D,
  };

  const mutationToolCall: MessageProperty[] = [
    {
      id: generateId(),
      role: "assistant",
      content: [
        {
          type: "tool-call",
          toolCallId: id,
          toolName: name,
          args,
        },
      ],
    },
    {
      id: generateId(),
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolCallId: id,
          toolName: name,
          result: JSON.stringify(constructToolResult),
        },
      ],
    },
  ];

  if (payload.overrideAssistant) {
    mutationToolCall.push({
      id: generateId(),
      role: "assistant",
      content: payload.overrideAssistant.content,
    });
  }

  return { mutate: mutationToolCall };
};

export const handleSaveChat = async (
  state: AIState,
  session: Session | null
) => {
  const { chatId, messages } = state;

  const userId = session?.user?.email || "anonymous";

  let chatTitle: string = "";

  const currentChatData = await getChat(chatId);

  if (!currentChatData || currentChatData.title) {
    try {
      const payloadTitleMsg = messages.filter((m) => m.role !== "tool");
      const SYSTEM_INSTRUCTION = `You are a title generation AI assistant.
Given a passage of text provided by the user, your task is to compose a concise, attention-grabbing title that accurately reflects the content, with a length between 5 and 8 words.
Your title should be informative, engaging, and optimized for web display.
Focus on extracting the key themes and ideas from the input text, and craft a title that is both descriptive and compelling.
Analyze the user's text for important keywords, central topics, and the overall narrative or message.
Use this information to generate a title that is succinct, impactful, and effective at summarizing the core content in an elegant, readable format suitable for web page titles.`;

      const { text } = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: JSON.stringify(payloadTitleMsg),
        system: SYSTEM_INSTRUCTION,
      });
      chatTitle = text;
    } catch (error) {
      console.error(error);

      const [userMsg] = messages;
      if (typeof userMsg.content === "string") {
        chatTitle = userMsg.content;
      } else {
        chatTitle =
          (userMsg.content[0] as TextPart).text.substring(0, 100) || "Untitled";
      }
    }
  }

  const savePayload = {
    chatId,
    userId,
    created: new Date(),
    title: chatTitle,
    messages,
  };

  _debugHelper('saved-ai-state', savePayload)

  await saveChat(userId, savePayload);
};

export const toCoreMessage = (m: MessageProperty[]): CoreMessage[] => {
  return m.map((m) => ({ role: m.role, content: m.content } as CoreMessage));
};
