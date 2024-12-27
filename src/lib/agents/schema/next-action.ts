import { DeepPartial } from "ai";
import { z } from "zod";

export const nextActionSchema = z.object({
  next: z
    .enum(["inquire", "proceed"])
    .describe(
      "Determines the next action for processing a user query. 'inquire' indicates additional information is needed, while 'proceed' suggests the query can be directly addressed."
    ),
});

export type NextAction = z.infer<typeof nextActionSchema>;

export type PartialNextAction = DeepPartial<typeof nextActionSchema>;
