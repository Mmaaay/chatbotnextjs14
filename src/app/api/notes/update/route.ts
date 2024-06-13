import prisma from "@/lib/db/prisma";
import { updateNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, res: NextResponse) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return Response.json(
        { error: "unauthorized" },
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    const body = await req.json();
    const { data, success, error } = updateNoteSchema.safeParse(body);
    if (!success) {
      return Response.json(
        { error: error.errors },
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const { id, title, content } = data;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note || note.userId !== userId) {
      return Response.json(
        { error: "Note not found" },
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    return Response.json({ note: updatedNote }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: `internal server error ${error}` },
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
