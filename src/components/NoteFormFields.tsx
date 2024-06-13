import { FC } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Note } from "@prisma/client";

interface NoteFormFieldsProps {
  noteToEdit?: Note;
}

const NoteFormFields: FC<NoteFormFieldsProps> = ({ noteToEdit }) => {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
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
        control={control}
        name="content"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel htmlFor={field.name}>Content</FormLabel>
            <FormControl>
              <Textarea placeholder="Your Note Content" {...field} />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </>
  );
};

export default NoteFormFields;
