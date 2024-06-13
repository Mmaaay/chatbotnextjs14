import {
  HfInference,
  TextGenerationInput,
  TextGenerationOutput,
  textGeneration,
} from "@huggingface/inference";
import { RecordValues } from "@pinecone-database/pinecone";
import { ChatCompletionMessage } from "openai/resources/index.mjs";

const HF_TOKEN = process.env.HF_TOKEN;

if (!HF_TOKEN) {
  throw new Error("HF_TOKEN is not set");
}

export const inference = new HfInference(HF_TOKEN);

export const getEmbedding = async (text: string) => {
  const response = await inference.featureExtraction({
    model: "intfloat/multilingual-e5-large",
    inputs: text,
  });
  if (!response) {
    throw new Error("Failed to get valid embedding response");
  }

  // Flatten the nested array to ensure it is a single array of numbers
  const embedding = response;

  return embedding as RecordValues;
};

// export const getAnswer = async (messages: ChatCompletionMessage[]) => {
//   try {
//     const input = messages[0].content;
//     console.log(input);

//     return response.generated_text;
//   } catch (error: any) {
//     console.error("Error in getAnswer:", error);
//     throw new Error(
//       "An error occurred while fetching the answer: " + error.message,
//     );
//   }
// };
