import { FC } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db/prisma";
import NoteLayout from "@/components/Note";

interface pagesProps {}

const Page: FC<pagesProps> = async ({}) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note, indexs) => (
        <NoteLayout key={indexs} note={note} />
      ))}
      {notes.length === 0 && (
        <div className="col-span-full text-center">
          {"You don't have any notes yet, why don't you create one"}
        </div>
      )}
    </div>
  );
};

export default Page;
