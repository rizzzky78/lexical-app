import { DeepPartial } from "ai";
import { z } from "zod";

export const inquirySchema = z
  .object({
    question: z
      .string()
      .min(1, { message: "Question must not be empty" })
      .max(500, { message: "Question must be less than 500 characters" })
      .describe("The main inquiry question presented to the user"),

    options: z
      .array(
        z.object({
          value: z
            .string()
            .min(1, { message: "Option value must not be empty" })
            .max(200, {
              message: "Option value must be less than 200 characters",
            }),
          label: z
            .string()
            .min(1, { message: "Option label must not be empty" })
            .max(250, {
              message: "Option label must be less than 250 characters",
            }),
        })
      )
      .min(1, { message: "At least one option must be provided" })
      .max(10, { message: "Maximum of 10 options allowed" })
      .describe("The list of selectable options for the inquiry"),

    allowsInput: z
      .boolean()
      .describe("Whether additional free-form input is permitted"),

    inputLabel: z
      .string()
      .optional()
      .describe("The label for the additional input field"),

    inputPlaceholder: z
      .string()
      .optional()
      .describe("The placeholder text for the additional input field"),

    type: z
      .enum(["single", "multiple"], {
        description:
          "The type of selection allowed (single or multiple options)",
      })
      .default("single"),
  })
  .strict();

export type Inquiry = z.infer<typeof inquirySchema>;

export type PartialInquiry = DeepPartial<typeof inquirySchema>;
