import { tool } from "ai";
import logger from "@/lib/utility/logger/root";
import { firecrawlInputSchema } from "./schema/firecrawl";
import { fireCrawlClient } from "./api/firecrawl";

const TOOL_DESCRIPTION = ``;

export const tavilySearch = tool({
  description: TOOL_DESCRIPTION,
  parameters: firecrawlInputSchema,
  execute: async (requestProperties) => {
    logger.info("Using Firecrawl api tool", { requestProperties });

    const contentResult = await fireCrawlClient.handleRequest(
      requestProperties
    );

    logger.info("Done using Firecrawl tool", {
      isHasValue: contentResult ? true : false,
    });

    return contentResult ?? "An error occured or search doesn't return value!";
  },
});
