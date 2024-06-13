import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/huggingface";
import { createNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return Response.json(
        { error: "unauthorized" },
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    const body = await req.json();
    const { data, success, error } = createNoteSchema.safeParse(body);
    if (!success) {
      return Response.json(
        { error: error.errors },
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const { title, content } = data;

    const embedding = await getEmbeddingForNote(title, content);

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });

      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: {
            userId,
          },
        },
      ]);

      return note;
    });

    return Response.json({ note }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: `internal server error ${error}` },
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

async function getEmbeddingForNote(title: string, content: string | undefined) {
  const text = title + "\n\n" + content ?? "";
  const result = await getEmbedding(text);
  return result;
}
