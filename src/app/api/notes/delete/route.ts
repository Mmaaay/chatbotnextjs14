import prisma from "@/lib/db/prisma";
import { deleteNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return Response.json(
        { error: "unauthorized" },
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    const body = await req.json();
    const { data, success, error } = deleteNoteSchema.safeParse(body);
    if (!success) {
      return Response.json(
        { error: error.errors },
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const { id } = data;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note || note.userId !== userId) {
      return Response.json(
        { error: "Note not found" },
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    await prisma.note.delete({
      where: { id },
    });

    return Response.json({ message: "Note Deleted" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: `internal server error ${error}` },
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
