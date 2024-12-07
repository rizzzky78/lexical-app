import { tool } from "ai";
import logger from "@/lib/utility/logger/root";
import { serperRequestSchema } from "./schema/serper";
import { serper } from "./api/serper";

const TOOL_DESCRIPTION = ``;

export const serperSearch = tool({
  description: TOOL_DESCRIPTION,
  parameters: serperRequestSchema,
  execute: async (request) => {
    logger.info("Using Serper Search tool", { request });

    const contentResult = await serper.search(request);

    logger.info("Done using Serper Search tool", {
      isHasValue: contentResult ? true : false,
    });

    return contentResult ?? "An error occured or search doesn't return value!";
  },
});
