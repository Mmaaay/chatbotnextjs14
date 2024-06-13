"use client";

import { Note } from "@prisma/client";
import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AddEditNoteDialog from "./AddEditNoteDialog";

interface NoteProps {
  note: Note;
}

const NoteLayout: FC<NoteProps> = ({ note }) => {
  const [ShowEdit, setShowEdit] = useState<boolean>(false);
  const wasUpdated = note.updatedAt > note.createdAt;

  const createdUpdatedAtTimeStamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();
  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => setShowEdit(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimeStamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="whitespace-pre-line">
          {note.content}
        </CardContent>
      </Card>
      <AddEditNoteDialog
        open={ShowEdit}
        setOpen={setShowEdit}
        noteToEdit={note}
      />
    </>
  );
};

export default NoteLayout;
