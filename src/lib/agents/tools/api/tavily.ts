import type {
  TavilyClient,
  TavilyClientOptions,
  TavilySearchOptions,
  TavilySearchResponse,
  TavilySearchContextResponse,
  TavilyExtractResponse,
} from "@/lib/types/tavily";
import { timestampDate } from "@/lib/utility/date/root";
import logger from "@/lib/utility/logger/logger";
import { tavily } from "@tavily/core";

/**
 * Custom error class for Tavily-specific search errors
 */
class TavilySearchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TavilySearchError";
  }
}

/**
 * Tavily Search Client for performing various search operations
 * Provides methods for standard search, context search, Q&A search, and content extraction
 */
export class Tavily {
  /**
   * Internal Tavily API client
   * @private
   */
  private client: TavilyClient;

  /**
   * Initialize Tavily client with optional configuration
   * @param options - Configuration options for Tavily client
   */
  constructor(options?: TavilyClientOptions) {
    this.client = tavily({
      apiKey: process.env.TAVILY_API_KEY ?? options?.apiKey,
    });
  }

  /**
   * Perform a standard web search
   * @param query - Search query string
   * @param options - Optional search configuration
   * @returns Structured search response with timestamp
   * @throws {TavilySearchError} If search fails or query is invalid
   */
  async search(
    query: string,
    options: TavilySearchOptions = {}
  ): Promise<TavilySearchResponse> {
    // Validate input
    this.validateQuery(query, "search");

    try {
      const response = await this.client.search(query, {
        maxResults: 5, // Default sensible limit
        ...options,
      });

      if (!response.results?.length) {
        logger.warn(`No results found for query: ${query}`);
      }

      return {
        ...response,
        timestamp: timestampDate.format(new Date()),
      };
    } catch (error) {
      this.handleSearchError(error, "Search", query);
    }
  }

  /**
   * Perform a contextual search to extract detailed information
   * @param query - Search query string
   * @param options - Optional search configuration
   * @returns Parsed context results
   * @throws {TavilySearchError} If context search fails or query is invalid
   */
  async searchContext(
    query: string,
    options: TavilySearchOptions = {}
  ): Promise<TavilySearchContextResponse[]> {
    // Validate input
    this.validateQuery(query, "context search");

    try {
      const result = await this.client.searchContext(query, options);

      if (!result) {
        logger.warn(`No context found for query: ${query}`);
        return [];
      }

      // Double parsing due to potential JSON serialization
      const context = JSON.parse(JSON.parse(result));

      return context;
    } catch (error) {
      this.handleSearchError(error, "Context Search", query);
    }
  }

  /**
   * Perform a Question and Answer style search
   * @param query - Search query string
   * @param options - Optional search configuration
   * @returns Extracted answer string
   * @throws {TavilySearchError} If QnA search fails or query is invalid
   */
  async searchQNA(
    query: string,
    options: TavilySearchOptions = {}
  ): Promise<string> {
    // Validate input
    this.validateQuery(query, "QnA search");

    try {
      const answer = await this.client.searchQNA(query, {
        searchDepth: options.searchDepth ?? "basic", // Default search depth
        ...options,
      });

      if (!answer) {
        logger.warn(`No answer found for query: ${query}`);
        return "No definitive answer could be found.";
      }

      return answer;
    } catch (error) {
      this.handleSearchError(error, "QnA Search", query);
    }
  }

  /**
   * Extract content from given URLs
   * @param urls - Array of URLs to extract content from
   * @returns Extracted content for each URL
   * @throws {TavilySearchError} If extraction fails
   */
  async extract(urls: string[]): Promise<TavilyExtractResponse> {
    // Validate URL input
    if (!urls || urls.length === 0) {
      throw new TavilySearchError(
        "At least one URL is required for extraction"
      );
    }

    try {
      return await this.client.extract(urls);
    } catch (error) {
      logger.error("Content extraction failed", { urls, error });
      throw new TavilySearchError(
        `Content extraction failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Validate search query to prevent empty or invalid inputs
   * @param query - Query to validate
   * @param searchType - Type of search being performed
   * @private
   */
  private validateQuery(query: string, searchType: string): void {
    if (!query || !query.trim()) {
      throw new TavilySearchError(`${searchType} query cannot be empty`);
    }

    // Optional: Add more sophisticated query validation if needed
    if (query.length > 500) {
      throw new TavilySearchError(
        "Query is too long. Maximum 500 characters allowed."
      );
    }
  }

  /**
   * Centralized error handling for search operations
   * @param error - Caught error
   * @param searchType - Type of search being performed
   * @param query - Original search query
   * @private
   */
  private handleSearchError(
    error: unknown,
    searchType: string,
    query: string
  ): never {
    logger.error(`${searchType} failed`, { query, error });

    if (error instanceof Error) {
      throw new TavilySearchError(
        `${searchType} operation failed: ${error.message}`
      );
    }

    throw new TavilySearchError(
      `${searchType} operation encountered an unknown error`
    );
  }
}

export const tavilySearchClient = new Tavily();

export default Tavily;
