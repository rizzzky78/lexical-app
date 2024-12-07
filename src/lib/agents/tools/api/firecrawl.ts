import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";
import logger from "@/lib/utility/logger/root"; // Assume a logger utility exists
import { firecrawlInputSchema } from "@/lib/agents/tools/schema/firecrawl";
import { getEnv } from "@/lib/utils";
import {
  FireCrawlOptions,
  RequestProperties,
  FirecrawlAction,
  ScrapeOptions,
  CrawlOptions,
  MapOptions,
} from "@/lib/types/firecrawl";

// Custom error for Firecrawl-specific errors
class FirecrawlError extends Error {
  constructor(message: string, public metadata?: Record<string, any>) {
    super(message);
    this.name = "FirecrawlError";
  }
}

/**
 * Firecrawl Client for web scraping, crawling, and mapping
 * Provides a robust interface for different web content extraction methods
 */
export class FireCrawlClient {
  /**
   * Internal Firecrawl application instance
   * @private
   */
  private readonly app: FirecrawlApp;

  /**
   * Configuration options for Firecrawl client
   * @private
   */
  private readonly config: {
    defaultWaitTime: number;
    maxRetries: number;
    retryDelay: number;
  };

  /**
   * Initialize Firecrawl client with API key and optional configuration
   * @param params - Initialization parameters
   * @param params.apiKey - Firecrawl API key
   */
  constructor(options?: FireCrawlOptions) {
    const apiKey = options?.apiKey ?? getEnv("FIRECRAWL_API_KEY");
    // Validate API key
    if (!apiKey) {
      throw new FirecrawlError("Firecrawl API key is required");
    }

    this.app = new FirecrawlApp({ apiKey });

    // Default configuration with optional overrides
    this.config = {
      defaultWaitTime: 2000,
      maxRetries: 3,
      retryDelay: 1000,
      ...options?.config,
    };
  }

  /**
   * Execute a Firecrawl request with comprehensive validation and error handling
   * @param input - Request input with action and options
   * @returns Processed response based on action type
   */
  async handleRequest(input: RequestProperties) {
    try {
      // Validate input against schema
      const validatedInput = firecrawlInputSchema.parse(input);

      // Log request details for traceability
      logger.info("Firecrawl request initiated", {
        action: validatedInput.action,
        url: validatedInput[`${validatedInput.action}Options`]?.url,
      });

      // Delegate to specific handler based on action
      const result = await this.handleResponse(validatedInput);

      return result;
    } catch (error) {
      this.handleError(error, input);
    }
  }

  /**
   * Route request to appropriate handler based on action type
   * @param prop - Validated request properties
   * @private
   */
  private async handleResponse(prop: RequestProperties) {
    switch (prop.action) {
      case FirecrawlAction.Scrape:
        return await this.handleScrape(prop.scrapeOptions!);
      case FirecrawlAction.Crawl:
        return await this.handleCrawl(prop.crawlOptions!);
      case FirecrawlAction.Map:
        return await this.handleMap(prop.mapOptions!);
      default:
        throw new FirecrawlError("Invalid action type", {
          action: prop.action,
        });
    }
  }

  /**
   * Handle URL scraping with advanced options and retry mechanism
   * @param options - Scraping configuration options
   * @private
   */
  private async handleScrape(options: ScrapeOptions) {
    const scrapeOptions = {
      waitFor: options.waitFor ?? this.config.defaultWaitTime,
      formats: options.formats,
      extract: options.formats.includes("extract")
        ? {
            systemPrompt: options.systemPrompt,
            prompt: options.prompt,
          }
        : undefined,
    };

    return this.executeWithRetry(
      () => this.app.scrapeUrl(options.url, scrapeOptions),
      "Scrape",
      { url: options.url }
    );
  }

  /**
   * Handle website crawling with comprehensive options
   * @param options - Crawling configuration options
   * @private
   */
  private async handleCrawl(options: CrawlOptions) {
    const crawlOptions = {
      maxDepth: options.maxDepth ?? 1,
      limit: options.limit ?? 10,
      allowBackwardLinks: options.allowBackwardLinks ?? false,
      allowExternalLinks: options.allowExternalLinks ?? false,
      ignoreSitemap: options.ignoreSitemap ?? false,
      scrapeOptions: {
        waitFor: options.waitFor ?? this.config.defaultWaitTime,
        formats: options.formats,
      },
    };

    return this.executeWithRetry(
      () => this.app.crawlUrl(options.url, crawlOptions),
      "Crawl",
      { url: options.url }
    );
  }

  /**
   * Handle URL mapping with configurable limits
   * @param options - Mapping configuration options
   * @private
   */
  private async handleMap(options: MapOptions) {
    const mapOptions = {
      limit: options.limit ?? 10,
    };

    return this.executeWithRetry(
      () => this.app.mapUrl(options.url, mapOptions),
      "Map",
      { url: options.url }
    );
  }

  /**
   * Generic retry mechanism for Firecrawl operations
   * @param operation - Function to execute
   * @param actionType - Type of Firecrawl action
   * @param context - Additional context for logging
   * @private
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    actionType: string,
    context: Record<string, any>
  ): Promise<T> {
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const result = await operation();

        if (!result) {
          throw new FirecrawlError(`${actionType} returned no data`, context);
        }

        return result;
      } catch (error) {
        if (attempt === this.config.maxRetries) {
          throw error;
        }

        logger.warn(`${actionType} attempt ${attempt} failed`, {
          ...context,
          error: error instanceof Error ? error.message : error,
          nextAttemptIn: this.config.retryDelay,
        });

        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, this.config.retryDelay * attempt)
        );
      }
    }

    throw new FirecrawlError(`${actionType} failed after max retries`, context);
  }

  /**
   * Centralized error handling for Firecrawl operations
   * @param error - Caught error
   * @param input - Original request input
   * @private
   */
  private handleError(error: unknown, input: RequestProperties): never {
    if (error instanceof z.ZodError) {
      logger.error("Input validation failed", {
        errors: error.errors,
        input,
      });
      throw new FirecrawlError("Invalid input", {
        validationErrors: error.errors,
      });
    }

    if (error instanceof FirecrawlError) {
      logger.error("Firecrawl operation error", {
        message: error.message,
        metadata: error.metadata,
      });
      throw error;
    }

    logger.error("Unexpected Firecrawl error", {
      error: error instanceof Error ? error.message : error,
      input,
    });

    throw new FirecrawlError("Unexpected error during Firecrawl operation", {
      originalError: error,
    });
  }
}

export const fireCrawlClient = new FireCrawlClient();

export default FireCrawlClient;
