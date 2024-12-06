/**
 * Core enums and constants
 */
export type SerperSearchType =
  | "search"
  | "images"
  | "videos"
  | "places"
  | "news"
  | "shopping"
  | "scholar"
  | "patents";

/**
 * Base interfaces for common properties
 */
interface BaseEntity {
  position?: number;
}

interface LinkEntity extends BaseEntity {
  title?: string;
  link?: string;
}

interface RatingEntity {
  rating?: number;
  ratingCount?: number;
}

interface TimestampEntity {
  date?: string;
}

interface ImageEntity {
  imageUrl?: string;
  thumbnailUrl?: string;
}

interface PriceEntity {
  price?: number | string;
  currency?: string;
  priceRange?: string;
}

/**
 * Request types
 *
 * Required parameters is `q` and `type`, other are optional
 */
export interface SerperSearchParameters {
  q: string;
  type: SerperSearchType;

  /** Optional parameters */
  gl?: string;
  hl?: string;
  num?: number;
  page?: number;
  tbs?: string;
  location?: string;
  engine?: string;
}

export interface SerperRequestBody {
  q: string;
  gl?: string | null;
  location?: string | null;
  hl?: string | null;
  tbs?: string | null;
  num?: number | null;
}

export interface SerperRequestConfig {
  type: SerperSearchType;
  body: SerperRequestBody;
}

/**
 * Response base types
 */
export interface SerperBaseResponse {
  searchParameters: SerperSearchParameters;
  credits: number;
}

/**
 * Specific result types
 */
export interface OrganicResult
  extends LinkEntity,
    RatingEntity,
    TimestampEntity,
    PriceEntity {
  snippet?: string;
  sitelinks?: LinkEntity[];
  attributes?: Record<string, string>;
}

export interface AnswerBox extends LinkEntity, TimestampEntity {
  snippet?: string;
  snippetHighlighted?: string[];
}

export interface PeopleAlsoAsk extends LinkEntity {
  question?: string;
  snippet?: string;
}

export interface RelatedSearch {
  query: string;
}

export interface ImageResult extends BaseEntity {
  title?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  thumbnailUrl?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  source?: string;
  domain?: string;
  link?: string;
  googleUrl?: string;
}

export interface VideoResult extends LinkEntity, TimestampEntity, ImageEntity {
  snippet?: string;
  duration?: string;
  source?: string;
  channel?: string;
}

export interface PlaceResult extends BaseEntity, RatingEntity {
  title?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  phoneNumber?: string;
  website?: string;
  cid?: string;
}

export interface NewsResult extends LinkEntity, TimestampEntity, ImageEntity {
  section?: string;
  source?: string;
  snippet?: string;
}

export interface ShoppingResult extends LinkEntity, RatingEntity, ImageEntity {
  source?: string;
  delivery?: string;
  offers?: string;
  productId?: string;
}

export interface ScholarResult extends LinkEntity {
  publicationInfo?: string;
  snippet?: string;
  year?: number;
  citedBy?: number;
}

/**
 * Response types for search type **Search**
 */
export interface SerperSearchResults extends SerperBaseResponse {
  answerBox?: AnswerBox;
  organic: OrganicResult[];
  peopleAlsoAsk?: PeopleAlsoAsk[];
  relatedSearches?: RelatedSearch[];
}

/**
 * Response types for search type **Images**
 */
export interface SerperImageResults extends SerperBaseResponse {
  images: ImageResult[];
}

/**
 * Response types for search type **Videos**
 */
export interface SerperVideoResults extends SerperBaseResponse {
  videos: VideoResult[];
}

/**
 * Response types for search type **Places**
 */
export interface SerperPlaceResults extends SerperBaseResponse {
  places: PlaceResult[];
}

/**
 * Response types for search type **News**
 */
export interface SerperNewsResults extends SerperBaseResponse {
  news: NewsResult[];
}

/**
 * Response types for search type **Shopping**
 */
export interface SerperShoppingResults extends SerperBaseResponse {
  shopping: ShoppingResult[];
}

/**
 * Response types for search type **Scholar**
 */
export interface SerperScholarResults extends SerperBaseResponse {
  organic: ScholarResult[];
}

/**
 * Combined response type
 */
export type SerperResponse = SerperSearchResults &
  SerperImageResults &
  SerperVideoResults &
  SerperPlaceResults &
  SerperShoppingResults &
  SerperNewsResults;

/**
 * Response type for Serper API function
 */
export interface SerperResultsResponse<T = SerperResponse> {
  timestamp: string;
  type: SerperSearchType;
  data: T;
}

// Type alias for request
export type Req = z.infer<typeof serperRequestSchema>;

// Options for Serper client initialization
export type SerperOptions = {
  apikey?: string;
  timeout?: number;
  retries?: number;
};
