import { AssistantMessageType, UserMessageType } from "@/lib/types/ai";
import { CoreMessage } from "ai";

type ExtractionOption = {
  type: UserMessageType | AssistantMessageType;
  raw: boolean;
};

export function extract<T>(
  content: CoreMessage["content"],
  option: ExtractionOption
) {
  
}
