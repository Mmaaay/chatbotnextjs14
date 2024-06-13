import { FC, useState } from "react";
import { boolean } from "zod";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import AiChatBox from "./AiChatBox";

interface AiChatButtonProps {}

const AiChatButton: FC<AiChatButtonProps> = ({}) => {
  const [chatOpenBox, setchatOpenBox] = useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setchatOpenBox(true)}>
        <Bot size={20} />
        Ai Chat
      </Button>
      <AiChatBox open={chatOpenBox} onClose={() => setchatOpenBox(false)} />
    </>
  );
};

export default AiChatButton;
