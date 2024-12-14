import { CoreMessage, streamObject } from "ai";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { Inquiry, inquirySchema, PartialInquiry } from "../schema/inquiry";
import { google } from "@ai-sdk/google";

const SYSTEM_INSTRUCTION = `As a professional web researcher, your role is to deepen your understanding of the user's input by conducting further inquiries when necessary.

After receiving an initial response from the user, carefully assess whether additional questions are absolutely essential to provide a comprehensive and accurate answer. Only proceed with further inquiries if the available information is insufficient or ambiguous.

When crafting your inquiry, adhere to the following structured approach:
{
  "question": "A clear, concise question that seeks to clarify the user's intent or gather more specific details.",
  "options": [
    {"value": "option1_in_english", "label": "Option label in the user's current language"},
    {"value": "option2_in_english", "label": "Another option label in the user's current language"},
    ...
  ],
  "allowsInput": true/false, // Indicates whether the user can provide a free-form input
  "inputLabel": "Input label in the user's current language",
  "inputPlaceholder": "Placeholder text in the user's current language"
}

Key Principles:
1. Option Values: Always use English
   - Ensures consistency and standardization across different languages
   - Facilitates easier backend processing and analysis

2. Localization Requirements:
   - Question: Match the user's current language
   - Option Labels: Match the user's current language
   - Input Label: Match the user's current language
   - Placeholder Text: Match the user's current language

Example Demonstration:
{
  "question": "¿Qué información específica busca sobre Rivian?", // Spanish question
  "options": [
    {"value": "history", "label": "Historia"},
    {"value": "products", "label": "Productos"},
    {"value": "investors", "label": "Inversores"},
    {"value": "partnerships", "label": "Asociaciones"},
    {"value": "competitors", "label": "Competidores"}
  ],
  "allowsInput": true,
  "inputLabel": "Si es otro, especifique",
  "inputPlaceholder": "p. ej., Especificaciones"
}

Strategic Objectives:
- Provide predefined options to guide users towards the most relevant query aspects
- Offer free-form input to capture additional context or specific details
- Ensure flexibility across different language contexts
- Maintain a consistent, standardized backend data structure

Execution Strategy:
- Dynamically adapt the inquiry interface to the user's language
- Keep the core data model consistent with English value keys
- Maximize user comprehension and engagement through localized presentation

The ultimate goal remains delivering a thorough and accurate response by gathering precise, comprehensive information.`;

type InquiryPayload = {
  model: string;
  messages: CoreMessage[];
  scope?: "current" | "global";
  uiStream: ReturnType<typeof createStreamableUI>;
};

export async function inquire({
  model,
  messages,
  scope = "current",
  uiStream,
}: InquiryPayload): Promise<Inquiry> {
  let finalInquiry: PartialInquiry = {};

  const streamableObject = createStreamableValue<PartialInquiry>();
  uiStream.append(<div>UI</div>);

  const currentMessages = messages.slice(-1).map((m) => {
    return { ...m, role: "user" } as CoreMessage;
  });

  const payloadMessages = scope === "current" ? currentMessages : messages;

  const { partialObjectStream, object } = streamObject({
    model: google("gemini-1.5-pro-exp-0827"),
    system: SYSTEM_INSTRUCTION,
    messages: payloadMessages,
    schema: inquirySchema,
    onFinish: async (finishedResult) => {
      streamableObject.done(finalInquiry);
    },
  });

  for await (const inquiry of partialObjectStream) {
    if (inquiry) {
      finalInquiry = inquiry;
      streamableObject.update(inquiry);
    }
  }

  return await object;
}
