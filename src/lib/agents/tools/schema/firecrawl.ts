import { z } from "zod";

// Common formats for scraping or crawling
const scrapeFormats = z.enum([
  "markdown",
  "html",
  "rawHtml",
  "content",
  "links",
  "screenshot",
  "screenshot@fullPage",
  "extract",
]);

// Enhanced schema for the `scrape` option
export const scrapeOptionSchema = z
  .object({
    url: z
      .string()
      .url()
      .describe("The target URL to scrape. Must be a valid and reachable URL."),
    waitFor: z
      .number()
      .min(100)
      .optional()
      .describe(
        "Wait time in milliseconds for the page to load. Minimum value is 100ms. Defaults to 2000ms if not provided."
      ),
    formats: z
      .array(scrapeFormats)
      .nonempty()
      .describe(
        "An array of desired content formats to extract. At least one format must be specified."
      ),
    usePrompt: z
      .boolean()
      .optional()
      .describe(
        "A flag to indicate if AI prompts should be used for extraction. Required when 'extract' is in formats."
      ),
    systemPrompt: z
      .string()
      .optional()
      .describe(
        "A system-level instruction for extraction. Required when 'extract' is in formats."
      ),
    prompt: z
      .string()
      .optional()
      .describe(
        "A custom user prompt for extraction. Required when 'extract' is in formats."
      ),
  })
  .refine(
    (data) =>
      !data.formats.includes("extract") ||
      (data.usePrompt && data.systemPrompt && data.prompt),
    {
      message:
        "When 'extract' is included in formats, 'usePrompt', 'systemPrompt', and 'prompt' are required.",
      path: ["formats"],
    }
  );

// Enhanced schema for the `crawl` option
export const crawlOptionSchema = z.object({
  url: z
    .string()
    .url()
    .describe(
      "The base URL to start crawling. Must be a valid and reachable URL."
    ),
  maxDepth: z
    .number()
    .min(1)
    .describe(
      "The maximum depth to traverse during crawling. This represents the maximum link distance from the base URL."
    ),
  limit: z
    .number()
    .min(1)
    .describe(
      "The maximum number of pages to crawl. Ensures the process doesn't overwhelm resources or fetch unnecessary data."
    ),
  allowBackwardLinks: z
    .boolean()
    .optional()
    .describe(
      "Whether to allow backward links during crawling. Defaults to false if not provided."
    ),
  allowExternalLinks: z
    .boolean()
    .optional()
    .describe(
      "Whether to allow external links during crawling. Defaults to false if not provided."
    ),
  ignoreSitemap: z
    .boolean()
    .optional()
    .describe(
      "Whether to ignore the sitemap during crawling. Defaults to false. Useful for discovering hidden links."
    ),
  waitFor: z
    .number()
    .min(100)
    .optional()
    .describe(
      "Wait time in milliseconds for each page to load. Minimum value is 100ms."
    ),
  formats: z
    .array(scrapeFormats)
    .nonempty()
    .describe(
      "An array of desired content formats to extract during crawling."
    ),
});

// Enhanced schema for the `map` option
export const mapOptionSchema = z.object({
  url: z
    .string()
    .url()
    .describe("The target URL to map. Must be a valid and reachable URL."),
  limit: z
    .number()
    .min(1)
    .describe(
      "The maximum number of pages to map. Ensures that the mapping process doesn't overwhelm resources."
    ),
});

// Unified schema for LLM input
export const firecrawlInputSchema = z
  .object({
    action: z
      .enum(["scrape", "crawl", "map"])
      .describe(
        "The type of operation to perform. Capable only choose one from 'scrape', 'crawl', or 'map'."
      ),
    scrapeOptions: scrapeOptionSchema
      .optional()
      .describe(
        "Options specific to the scrape action. Required when action is 'scrape'."
      ),
    crawlOptions: crawlOptionSchema
      .optional()
      .describe(
        "Options specific to the crawl action. Required when action is 'crawl'."
      ),
    mapOptions: mapOptionSchema
      .optional()
      .describe(
        "Options specific to the map action. Required when action is 'map'."
      ),
  })
  .refine(
    (data) =>
      (data.action === "scrape" && data.scrapeOptions) ||
      (data.action === "crawl" && data.crawlOptions) ||
      (data.action === "map" && data.mapOptions),
    {
      message:
        "The corresponding options object (scrapeOptions, crawlOptions, or mapOptions) must be provided based on the chosen action.",
      path: ["action"],
    }
  );
