import Image from "next/image";
import logo from "@/assets/images.png";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { userId } = auth();

  if (userId) {
    redirect("/notes");
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Logo" width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          NoteAI
        </span>
      </div>
      <p className="max-w-prose text-center">
        Intelligent Note taking app built with OpenAI ChatGPT, Vercel AI SDK,
        Pinecone, Shadcn UI, TypeScript, Tailwind
      </p>
      <Button size="lg" asChild>
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
};

export default page;
