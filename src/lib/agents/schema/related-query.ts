import { DeepPartial } from "ai";
import { z } from "zod";

export const relatedSchemaOutput = z.object({
  items: z
    .array(
      z.object({
        query: z.string(),
      })
    )
    .length(3),
});

export type PartialRelated = DeepPartial<typeof relatedSchemaOutput>;

export type RelatedQuery = z.infer<typeof relatedSchemaOutput>;
