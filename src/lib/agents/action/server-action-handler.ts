import { google } from "@ai-sdk/google";
import { CoreMessage, generateId, generateText, TextPart } from "ai";
import { getServerSession } from "next-auth";
import { getChat, saveChat } from "./chat-service";
import { AIState, ChatProperties, MessageProperty } from "@/lib/types/ai";

export const AvailableTools = {
  SEARCH_PRODUCT: "searchProduct",
  GET_PRODUCT_DETAILS: "getProductDetails",
} as const;

export type AvailableTool =
  (typeof AvailableTools)[keyof typeof AvailableTools];

export interface Payload {
  name: AvailableTool;
  args: unknown;
  result: unknown;
  overrideAssistant?: {
    content: string;
  };
}

interface ToolResult {
  success: boolean;
  data: unknown;
}

export const mutateTool = (payload: Payload) => {
  const { name, args, result } = payload;
  const id = generateId();

  const constructToolResult: ToolResult = {
    success: Boolean(result),
    data: result ?? null,
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
          args: { args },
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
          toolName: "searchProduct",
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

export const handleSaveChat = async (state: AIState) => {
  const { chatId, messages } = state;

  const session = await getServerSession();
  const userId = session?.user?.email || "anonymous";

  let chatTitle: string = "";

  const currentChatData = await getChat(userId);

  if (!currentChatData || currentChatData.title) {
    try {
      const payloadTitleMsg = messages.filter((m) => m.role !== "tool");
      const { text } = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: JSON.stringify(payloadTitleMsg),
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

  await saveChat(userId, {
    chatId,
    userId,
    created: new Date(),
    title: chatTitle,
    messages,
  });
};

export const toCoreMessage = (m: MessageProperty[]): CoreMessage[] => {
  return m.map((m) => ({ role: m.role, content: m.content } as CoreMessage));
};


