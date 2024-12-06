import { z } from "zod";

export const serperRequestSchema = z.object({
  query: z
    .string()
    .min(3, { message: "Query must be at least 3 characters long" })
    .transform((input) => {
      // Remove type-specific words and unnecessary prefixes
      const typePrefixes = [
        "search for",
        "find",
        "show me",
        "get",
        "a picture of",
        "pictures of",
        "video of",
        "videos of",
        "news about",
        "shopping for",
        "scholarly articles about",
      ];

      // Remove prefixes and trim
      let optimizedQuery = input.toLowerCase();
      for (const prefix of typePrefixes) {
        optimizedQuery = optimizedQuery.replace(
          new RegExp(`^${prefix}\\s*`),
          ""
        );
      }

      return optimizedQuery.trim();
    }).describe(`
      The search query for retrieving information:
      - Automatically optimizes query by removing unnecessary prefixes
      - Focuses on core search terms
      - Ensures concise and relevant search input
      
      Examples:
      - Input: "a picture of space x raptor engine"
        Optimized: "space x raptor engine"
      - Input: "show me Apple products"
        Optimized: "Apple products"
    `),

  type: z.enum([
    "search",
    "images",
    "videos",
    "places",
    "news",
    "shopping",
    "scholar",
    "patents",
  ]).describe(`
      Search endpoint type selection based purely on query context:
      - Choose type that best matches information need
      - Ignore the specific words in the query
      - Focus on the underlying intent
      
      Selection Guide:
      - Biographical/informational queries → 'search'
      - Visual content queries → 'images'
      - Current events → 'news'
      - Location-based queries → 'places'
      - Price and product queries → 'shopping'
      - Academic research → 'scholar'
      - Technical/innovation queries → 'patents'
    `),

  country: z.enum(["id", "us"]).describe(`
      Country identifier for search context:
      - 'id': Indonesia
      - 'us': United States
      
      Select based on:
      - User's implied location
      - Relevance of country-specific information
    `),

  location: z.enum(["id", "us"]).optional().describe(`
      Specifies search origin location for precise results:
      - 'id': Indonesia (specific regions)
      - 'us': United States (global/national)
    `),

  language: z.enum(["id", "us"]).describe(`
      Language selection for search results:
      - 'id': Indonesian
      - 'us': English (default)
      
      Based on:
      - Query language
      - Desired result language
    `),

  dateRange: z.enum(["H", "D", "W", "M", "Y", "A"]).default("A").describe(`
      Time-based search filter:
      - 'H': Last hour
      - 'D': Last day
      - 'W': Last week
      - 'M': Last month
      - 'Y': Last year
      - 'A': Any time
    `),

  results: z.number().min(10).max(20).describe(`
      Number of search results:
      - 10: Standard result set
      - 20: Comprehensive result set
    `),
});
