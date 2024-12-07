import {
  firecrawlInputSchema,
  scrapeOptionSchema,
  crawlOptionSchema,
  mapOptionSchema,
} from "@/lib/agents/tools/schema/firecrawl";
import { z } from "zod";

// Type aliases for improved readability
export type RequestProperties = z.infer<typeof firecrawlInputSchema>;
export type ScrapeOptions = z.infer<typeof scrapeOptionSchema>;
export type CrawlOptions = z.infer<typeof crawlOptionSchema>;
export type MapOptions = z.infer<typeof mapOptionSchema>;

// Enum for supported actions to improve type safety
export enum FirecrawlAction {
  Scrape = "scrape",
  Crawl = "crawl",
  Map = "map",
}

export type FireCrawlOptions = {
  apiKey?: string;
  config?: Partial<{
    defaultWaitTime: number;
    maxRetries: number;
    retryDelay: number;
  }>;
};
