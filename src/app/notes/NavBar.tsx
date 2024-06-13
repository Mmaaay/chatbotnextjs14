"use client";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import image from "@/assets/images.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import LightDark from "@/components/LightDark";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import AiChatButton from "@/components/AiChatButton";

interface NavBarProps {}

const NavBar: FC<NavBarProps> = ({}) => {
  const [showAddNoteDialog, setshowAddNoteDialog] = useState<boolean>(false);
  const { theme } = useTheme();
  return (
    <>
      <div className="p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-1">
            <Image src={image} alt="logo" width={40} height={40} />
            <span className="font-bold">AINote</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: {
                  avatarBox: {
                    width: "2.5rem",
                    height: "2.5rem",
                  },
                },
              }}
            />
            <Button onClick={() => setshowAddNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add Note
            </Button>
            <AiChatButton />
            <LightDark />
          </div>
        </div>
      </div>
      <AddEditNoteDialog
        open={showAddNoteDialog}
        setOpen={setshowAddNoteDialog}
      />
    </>
  );
};

export default NavBar;
