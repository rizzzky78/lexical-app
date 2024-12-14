import { google } from "@ai-sdk/google";
import { CoreMessage, generateObject } from "ai";
import { nextActionSchema } from "../schema/next-action";

const SYSTEM_INSTRUCTION = `Query Processing and Response Strategy Directive

Primary Objective:
Develop a precise decision-making framework to determine the most appropriate response strategy for user queries.

Decision Criteria:

1. Context Assessment
   - Thoroughly evaluate the completeness and clarity of the user's query
   - Identify potential information gaps or ambiguities
   - Determine the feasibility of generating a comprehensive response

2. Response Strategy Evaluation

   A. "Proceed" Conditions:
      - Query is specific and well-defined
      - Sufficient contextual information is available
      - Clear path to generating a comprehensive response exists
      - No critical information is missing

   B. "Inquire" Conditions:
      - Query lacks essential details
      - Multiple potential interpretations exist
      - Additional context would significantly improve response quality
      - Critical information is needed to provide a precise answer

3. Decision-Making Process

   Step 1: Initial Query Analysis
   - Parse the query's explicit and implicit requirements
   - Identify key information domains
   - Assess the query's completeness

   Step 2: Information Sufficiency Evaluation
   - Determine if existing information enables a comprehensive response
   - Identify specific areas requiring clarification

   Step 3: Strategic Response Selection
   - Choose between "proceed" or "inquire"
   - Select the option that maximizes response accuracy and relevance

4. Output Constraints
   - Strictly limited to two possible outputs: "proceed" or "inquire"
   - Decision must be binary and definitive
   - No additional explanatory text or alternatives allowed

Guiding Principle:
Optimize the response strategy to deliver the most precise, contextually relevant information while maintaining clarity and user engagement.

Example Scenarios:

Proceed Scenario:
Input: "What are the current specifications of the iPhone 15 Pro?"
Reasoning: Clear, specific query with a direct research path

Inquire Scenario:
Input: "What phone should I buy?"
Reasoning: Requires additional context about user preferences, budget, and needs

Final Instruction:
Produce a single, unambiguous output of either "proceed" or "inquire" that best represents the query's information sufficiency and research potential.`;

type TaskManagerPayload = {
  model: string;
  messages: CoreMessage[];
  scope?: "current" | "global";
};

export async function taskManager({
  model,
  messages,
  scope = "current",
}: TaskManagerPayload) {
  const currentMessages = messages.slice(-1).map((m) => {
    return { ...m, role: "user" } as CoreMessage;
  });

  const payloadMessages = scope === "current" ? currentMessages : messages;

  const { object } = await generateObject({
    model: google("gemini-1.5-pro-exp-0827"),
    system: SYSTEM_INSTRUCTION,
    messages: payloadMessages,
    schema: nextActionSchema,
  });

  return object;
}
