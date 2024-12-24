import { DeepPartial } from "ai";

export type Store = {
  name: string;
  location: string;
  isOfficial: boolean;
};

export type Product = {
  title: string;
  image: string;
  price: string;
  rating: string;
  sold: string;
  link: string;
  store: Store;
};

export type ProductsResponse = {
  data: Product[];
};

export type PartialProductsResponse = DeepPartial<ProductsResponse>;
