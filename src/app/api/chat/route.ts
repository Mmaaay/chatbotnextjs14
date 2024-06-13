import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/huggingface";
import { auth } from "@clerk/nextjs/server";
import { HfInference } from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessage } from "openai/resources/index.mjs";

export async function POST(req: NextRequest) {
  const HF_TOKEN = process.env.HF_TOKEN;
  const inference = new HfInference(HF_TOKEN);
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;
    const messagesTruncated = messages.slice(-6);
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const { userId } = auth();
    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const relevantNode = await prisma.note.findMany({
      where: {
        id: { in: vectorQueryResponse.matches.map((result) => result.id) },
      },
    });

    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are an intelligent note-taking app. you answer the use's last question based on existing notes" +
        "The relevant notes for this query are:\n" +
        relevantNode
          .map((node) => `Title: ${node.title}\n\nContent:\n${node.content}`)
          .join("\n\n"),
    };

    let result = "";
    for (let i = 0; i < messagesTruncated.length; i++) {
      if (i === messagesTruncated.length - 1) {
        result += "Last Question: " + messagesTruncated[i].content + " \n ";
      } else {
        result += messagesTruncated[i].content + " \n ";
      }
    }

    const userInput = {
      role: "user",
      content: result,
    };

    console.log(result);

    const finalMessages = [userInput, systemMessage];

    // Create a ReadableStream to stream the response
    const stream = new ReadableStream({
      async start(controller) {
        let out = "";

        for await (const chunk of inference.chatCompletionStream({
          model: "mistralai/Mistral-7B-Instruct-v0.2",
          messages: finalMessages,
          max_tokens: 250,
          temperature: 0.1,
          seed: 0,
        })) {
          if (chunk.choices && chunk.choices.length > 0) {
            const content = chunk.choices[0].delta.content;
            controller.enqueue(content);
            out += content;
          }
        }

        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error: any) {
    console.error("Error in POST route:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error: " + error.message }),
      { status: 500 },
    );
  }
}
