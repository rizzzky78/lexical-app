"use client";

import { AI } from "@/app/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UIComponent } from "@/lib/types/ai";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { ArrowRight } from "lucide-react";
import { FC, FormEvent, useState } from "react";

export const FollowupPanel: FC = () => {
  const [inputText, setInputText] = useState<string>("");

  const { submitMessage } = useActions<typeof AI>();
  const [_, setUIState] = useUIState<typeof AI>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const uiComponent: UIComponent = {
      id: generateId(),
      component: (
        <div>
          <h2>User Message</h2>
          <p>{inputText}</p>
        </div>
      ),
    };

    setUIState((currentUI) => [...currentUI, uiComponent]);

    const responseUi = await submitMessage({
      formData,
      userId: "not-set",
      model: "not-set",
      messageType: "text_input",
      classify: false,
      scope: {
        inquire: "global",
        related: "overall",
        taskManager: "global",
      },
    });

    setUIState((currentUI) => [...currentUI, uiComponent, responseUi]);

    setInputText("");
  };

  return (
    <div className="py-5">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center space-x-1"
      >
        <Input
          type="text"
          name="input"
          placeholder="Ask a follow-up question..."
          value={inputText}
          className="pr-14 h-12"
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button
          type="submit"
          size={"icon"}
          disabled={inputText.length === 0}
          variant={"ghost"}
          className="absolute right-1"
        >
          <ArrowRight size={20} />
        </Button>
      </form>
    </div>
  );
};
