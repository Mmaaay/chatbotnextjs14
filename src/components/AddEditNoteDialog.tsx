import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  createNoteSchema,
  createNoteType,
  deleteNoteType,
  updateNoteType,
} from "../lib/validation/note";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { Note } from "@prisma/client";

interface AddEditNoteDialog {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}

const AddEditNoteDialog: FC<AddEditNoteDialog> = ({
  open,
  setOpen,
  noteToEdit,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<createNoteType>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  useEffect(() => {
    if (noteToEdit) {
      form.reset({
        title: noteToEdit.title,
        content: noteToEdit?.content || "",
      });
    } else {
      form.reset({
        title: "",
        content: "",
      });
    }
  }, [noteToEdit, form]);

  const { mutate: addNote, isPending: isCreating } = useMutation({
    mutationFn: async ({ title, content }: createNoteType) => {
      const payload: createNoteType = { title, content };
      const { data } = await axios.post(`/api/notes`, payload);
      return data;
    },
    onSuccess: async () => {
      form.reset();
      setOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.refresh();
    },
  });

  const { mutate: editNote, isPending: isEditing } = useMutation({
    mutationFn: async (data: updateNoteType) => {
      const response = await axios.put(`/api/notes/update`, data);
      return response.data;
    },
    onSuccess: async () => {
      form.reset();
      setOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.refresh();
    },
  });

  const { mutate: deleteNote, isPending: isDeleting } = useMutation({
    mutationFn: async (data: deleteNoteType) => {
      const response = await axios.delete(`/api/notes/delete`, {
        data: { id: data.id },
      });

      return response.data;
    },
    onSuccess: async () => {
      setOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.refresh();
    },
  });

  const onSubmit = (data: createNoteType | updateNoteType) => {
    if (noteToEdit) {
      const payload = { ...data, id: noteToEdit.id } as updateNoteType;
      editNote(payload);
    } else {
      addNote(data as createNoteType);
    }
  };

  const handleDelete = () => {
    if (noteToEdit) {
      deleteNote({ id: noteToEdit.id });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Note Title" {...field} />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      required={false}
                      placeholder="Your Note Content"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <DialogFooter>
              {noteToEdit && (
                <Button
                  type="button"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                >
                  Delete Note
                </Button>
              )}
              <Button type="submit" isLoading={isCreating || isEditing}>
                {noteToEdit ? "Edit Note" : "Add Note"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditNoteDialog;
