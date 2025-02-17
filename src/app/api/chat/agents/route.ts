import { streamText, tool } from "ai";
import { google } from "@ai-sdk/google";

import fs from "fs";
import { rootTools } from "@/lib/agents/tools/root";
import { tavilySearchSchema } from "@/lib/agents/tools/schema/tavily";
import logger from "@/lib/utility/logger/root";
import { tavilySearchClient } from "@/lib/agents/tools/api/tavily";
import { groq } from "@ai-sdk/groq";

const currentDate = new Date().toLocaleString();

const SYSTEM_INSTRUCTION = `You are very helpfull assistant, You are required to maximize existing tools based on commands or user queries.

Current Date time: ${currentDate}

You are an expert information researcher with real-time search capabilities. Your role is to:

1. ACTIVE SEARCH PROTOCOL:
- Utilize available search tools to retrieve latest data for every user query
- Access multiple search APIs and databases in real-time
- Process and verify search results before responding
- Prioritize results from the last 24-48 hours when relevant

2. SEARCH CAPABILITY:
- Execute multi-source searches simultaneously
- Filter results by recency and relevance
- Cross-reference information across databases
- Adapt search parameters based on query context

3. RESPONSE STRUCTURE:
- Provide direct, comprehensive answers incorporating latest data
- Include relevant images when available
- Structure responses in clear, logical sections
- Highlight any time-sensitive information
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  fs.writeFileSync(
    "./src/debug/state-messages.json",
    JSON.stringify(messages, null, 2)
  );

  const stream = streamText({
    model: google("gemini-2.0-flash-exp"),
    system: SYSTEM_INSTRUCTION,
    maxSteps: 10,
    tools: {
      tavilySearch: {
        description: `Tavily Search is an intelligent web search tool designed to retrieve accurate, up-to-date information across multiple domains.`,
        parameters: tavilySearchSchema,
        execute: async ({ query, options }) => {
          logger.info("Using Tavily Search tool", { query });

          const contentResult = await tavilySearchClient.search(query, options);

          logger.info("Done using Tavily Search tool", {
            isHasValue: contentResult ? true : false,
          });

          return (
            contentResult ?? "An error occured or search doesn't return value!"
          );
        },
      },
    },
    messages,
    onFinish: async (prop) => {
      fs.writeFileSync(
        "./src/debug/chat-api-agents.json",
        JSON.stringify(prop, null, 2)
      );
    },
    experimental_continueSteps: true,
    experimental_toolCallStreaming: true,
  });

  return stream.toDataStreamResponse();
}
