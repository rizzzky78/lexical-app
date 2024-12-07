import { tool } from "ai";
import { tavilySearchSchema } from "./schema/tavily";
import { tavilySearchClient } from "./api/tavily";
import logger from "@/lib/utility/logger/root";

const TOOL_DESCRIPTION = `Tavily Search is an intelligent web search tool designed to retrieve accurate, up-to-date information across multiple domains. Key capabilities include:

- Perform dynamic web searches with configurable depth and topic specificity
- Retrieve comprehensive results from diverse online sources
- Generate direct answers to queries when possible
- Optional image search and retrieval
- Flexible domain inclusion/exclusion for targeted research
- Supports general, news, and finance-related searches
- Configurable result volume and content type

Use this tool when you need to:
- Gather real-time information on current events
- Research specific topics with customizable search parameters
- Obtain quick, relevant answers from web sources
- Cross-reference information from multiple domains
- Support fact-checking and information verification processes

Best practices:
- Specify clear, concise search queries
- Utilize topic and domain filters for precision
- Adjust search depth based on information complexity
- Review and validate retrieved information

The tool is particularly useful for tasks requiring current, web-based research and information synthesis.`;

export const tavilySearch = tool({
  description: TOOL_DESCRIPTION,
  parameters: tavilySearchSchema,
  execute: async ({ query, options }) => {
    logger.info("Using Tavily Search tool", { query });

    const contentResult = await tavilySearchClient.search(query, options);

    logger.info("Done using Tavily Search tool", {
      isHasValue: contentResult ? true : false,
    });

    return contentResult ?? "An error occured or search doesn't return value!";
  },
});
