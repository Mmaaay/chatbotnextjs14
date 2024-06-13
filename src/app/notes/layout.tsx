import React, { FC } from "react";
import NavBar from "./NavBar";
import AiChatBox from "@/components/AiChatBox";

interface layoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: layoutProps) => {
  return (
    <>
      <NavBar />
      <main className="m-auto max-w-7xl p-4">{children}</main>
    </>
  );
};

export default layout;
