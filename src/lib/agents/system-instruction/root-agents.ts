export const ROOT_SYSTEM_INSTRUCTION = (...arg: any[]) =>
  `You are very helpfull assistant, You are required to maximize existing tools based on commands or user queries.

Current date time: ${arg[0]}

Contexttual: ${arg[1] ?? "no contextual"}`;
