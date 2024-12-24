import { getMutableAIState } from "ai/rsc";
import { AI } from "./action-single";
import { CoreMessage, generateId } from "ai";

export type HandleToolContentPayload = {
  state: ReturnType<typeof getMutableAIState<typeof AI>>;
};

export type AvailableTool =
  | "searchProduct"
  | "getProductDetails"
  | ({} & string);

export type Payload = {
  name: AvailableTool;
  args: unknown;
  result: unknown;
  overrideAssistant?: {
    content: string;
  };
};

export function mutateTool(payload: Payload) {
  const { name, args, result } = payload;

  const id = generateId();
  const mutationToolCall: CoreMessage[] = [
    {
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
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolCallId: id,
          toolName: "searchProduct",
          result: JSON.stringify(result ?? "an error occured!"),
        },
      ],
    },
  ];

  if (payload.overrideAssistant) {
    mutationToolCall.push({
      role: "assistant",
      content: [
        {
          type: "text",
          text: payload.overrideAssistant.content,
        },
      ],
    });
  }

  return { mutate: mutationToolCall };
}
