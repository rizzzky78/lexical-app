// "use server";

// import { createAI, streamUI } from "ai/rsc";
// import { openai } from "@ai-sdk/openai";
// import { z } from "zod";

// import { ReactNode } from "react";
// import { xai } from "@ai-sdk/xai";
// import { google } from "@ai-sdk/google";
// import { CoreMessage, generateId } from "ai";

// export type SearchResult = {
//   title: string;
//   url: string;
// };

// export type SerperResult = {
//   title: string;
//   link: string;
// };

// export type AIResponse = ReactNode;

// // Simulated Tavily search function
// export async function searchTavily(query: string) {
//   // In a real application, you would call the Tavily API here
//   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
//   return [
//     { title: "Tavily Result 1", url: "https://example.com/1" },
//     { title: "Tavily Result 2", url: "https://example.com/2" },
//   ];
// }

// // Simulated Serper search function
// export async function searchSerper(query: string) {
//   // In a real application, you would call the Serper API here
//   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
//   return [
//     { title: "Serper Result 1", link: "https://example.com/3" },
//     { title: "Serper Result 2", link: "https://example.com/4" },
//   ];
// }

// type AIState = {
//   id: string;
//   messages: CoreMessage[];
// };

// type UIState = ReactNode[];

// export const AI = createAI<AIState, UIState>({
//   actions: {
//     generateResponse,
//   },
//   initialAIState: {
//     id: generateId(),
//     messages: [],
//   },
//   initialUIState: [],
// });

// export async function generateResponse(input: string) {
//   const ui = await streamUI({
//     model: google("gemini-1.5-pro"),
//     system:
//       "You are an AI assistant that generates UI components based on user queries. Use appropriate UI components to display information.",
//     prompt: input,
//     text: async ({ content }) => <p>{content}</p>,
//     tools: {
//       searchTavily: {
//         description: "Search the web using Tavily API",
//         parameters: z.object({
//           query: z.string().describe("The search query"),
//         }),
//         generate: async function* ({ query }) {
//           yield <p>Searching Tavily for: {query}</p>;
//           const results = await searchTavily(query);
//           return (
//             <div>
//               <h3>Tavily Search Results</h3>
//               <ul>
//                 {results.map((result, index) => (
//                   <li key={index}>
//                     <a
//                       href={result.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {result.title}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           );
//         },
//       },
//       searchSerper: {
//         description: "Search the web using Serper API",
//         parameters: z.object({
//           query: z.string().describe("The search query"),
//         }),
//         generate: async function* ({ query }) {
//           yield <p>Searching Serper for: {query}</p>;
//           const results = await searchSerper(query);
//           return (
//             <div>
//               <h3>Serper Search Results</h3>
//               <ul>
//                 {results.map((result, index) => (
//                   <li key={index}>
//                     <a
//                       href={result.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {result.title}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           );
//         },
//       },
//     },
//   });

//   return ui.value;
// }
