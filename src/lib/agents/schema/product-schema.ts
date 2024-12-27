import { z } from "zod";

export const productSchema = z.object({
  data: z.array(
    z.object({
      title: z.string().describe("Product title or name"),
      image: z.string().describe("Product image URL"),
      price: z.string().describe("Product price"),
      rating: z.string().describe("Product rating from 0.0 to 5.0"),
      sold: z.string().describe("Number of products sold"),
      link: z.string().describe("Product detail page URL"),
      store: z.object({
        name: z.string().describe("Store or seller name"),
        location: z.string().describe("Store location"),
        isOfficial: z
          .boolean()
          .describe("Whether the store is an official store"),
      }),
    })
  ),
});
