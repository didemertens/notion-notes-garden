import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { Factuality, Levenshtein } from "autoevals";
import { evalite } from "evalite";
import { traceAISDKModel } from "evalite/ai-sdk";

const model = anthropic('claude-3-5-haiku-latest');

evalite("Test Capitals", {
  data: async () => [
    {
      input: `What's the capital of France?`,
      expected: `Paris`,
    },
    {
      input: `What's the capital of Germany?`,
      expected: `Berlin`,
    },
  ],
  task: async (input) => {
    const result = await streamText({
      model: traceAISDKModel(model), // Wrap model to enable evaluation tracing
      system: `
        Answer the question concisely. Answer in as few words as possible.
        Remove full stops from the end of the output.
        If the country has no capital, return '<country> has no capital'.
        If the country does not exist, return 'Unknown'.
      `,
      prompt: input,
    });

    return result.textStream;
  },
  scorers: [Factuality, Levenshtein],
});