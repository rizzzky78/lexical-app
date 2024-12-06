import { getEnv } from "@/lib/utils";
import { serperRequestSchema } from "../schema/serper";
import logger from "@/lib/utility/logger/root";
import {
  Req,
  SerperImageResults,
  SerperNewsResults,
  SerperOptions,
  SerperPlaceResults,
  SerperRequestConfig,
  SerperSearchResults,
  SerperShoppingResults,
  SerperVideoResults,
} from "@/lib/types/serper";

// Custom error for Serper-specific exceptions
class SerperError extends Error {
  constructor(message: string, public details?: Record<string, unknown>) {
    super(message);
    this.name = "SerperError";
  }
}

class Serper {
  private apikey: string;
  private timeout: number;
  private maxRetries: number;

  /**
   * Initialize Serper search client
   * @param options - Configuration options for Serper client
   */
  constructor(options?: SerperOptions) {
    this.apikey = options?.apikey ?? getEnv("SERPER_API_KEY");
    this.timeout = options?.timeout ?? 10000; // 10 seconds default timeout
    this.maxRetries = options?.retries ?? 2; // Default 2 retries
  }

  /**
   * Perform a search with comprehensive error handling and retry mechanism
   * @param req - Search request configuration
   * @returns Typed search results based on search type
   */
  async search(req: Req) {
    // Validate input using Zod schema
    try {
      serperRequestSchema.parse(req);
    } catch (validationError) {
      logger.error("Serper search input validation failed", {
        error: validationError,
      });
      throw new SerperError("Invalid search parameters", {
        details:
          validationError instanceof Error
            ? validationError.message
            : validationError,
      });
    }

    const isAnytime = req.dateRange === "A";
    const request: SerperRequestConfig = {
      type: req.type,
      body: {
        q: req.query,
        gl: req.country ?? null,
        location: req.location ?? null,
        hl: req.language ?? null,
        tbs: isAnytime ? null : `qdr:${req.dateRange.toLowerCase()}`,
        num: req.results ?? 10, // Default to 10 results if not specified
      },
    };

    // Retry mechanism with exponential backoff
    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const serper_result = await fetch(
          `https://google.serper.dev/${request.type}`,
          {
            method: "POST",
            signal: controller.signal,
            headers: {
              "X-API-KEY": this.apikey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request.body),
          }
        );

        clearTimeout(timeoutId);

        // Handle non-200 responses
        if (!serper_result.ok) {
          const errorBody = await serper_result.text();
          logger.error("Serper API error", {
            status: serper_result.status,
            statusText: serper_result.statusText,
            body: errorBody,
          });

          throw new SerperError(
            `API request failed: ${serper_result.statusText}`,
            {
              status: serper_result.status,
              body: errorBody,
            }
          );
        }

        const response = await serper_result.json();

        // Detailed logging of search results
        logger.info("Serper search completed", {
          type: request.type,
          query: req.query,
        });

        // Type-safe result mapping
        switch (request.type) {
          case "images":
            return response as SerperImageResults;
          case "news":
            return response as SerperNewsResults;
          case "videos":
            return response as SerperVideoResults;
          case "shopping":
            return response as SerperShoppingResults;
          case "search":
            return response as SerperSearchResults;
          case "places":
            return response as SerperPlaceResults;
          default:
            logger.warn("Unsupported search type", { type: request.type });
            return null;
        }
      } catch (error) {
        // Exponential backoff for retries
        if (attempt === this.maxRetries + 1) {
          logger.error("Serper search failed after all retries", {
            error,
            request: {
              type: request.type,
              query: req.query,
            },
          });

          throw new SerperError("Search failed after multiple attempts", {
            originalError:
              error instanceof Error ? error.message : String(error),
          });
        }

        // Wait with exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        );
      }
    }

    return null;
  }
}

// Export a pre-configured Serper client instance
export const serper = new Serper();

export default Serper;
