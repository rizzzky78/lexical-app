'use client'

import { useState, useCallback } from "react";

type RecognizedPattern = {
  type: "url";
  title: string;
  value: string;
  expanded: boolean;
};

export function useSmartTextarea() {
  const [input, setInput] = useState("");
  const [patterns, setPatterns] = useState<RecognizedPattern[]>([]);

  const processInput = useCallback((text: string) => {
    try {
      const jsonData = JSON.parse(text);
      if (jsonData.title && jsonData.link) {
        setPatterns([
          {
            type: "url",
            title: jsonData.title,
            value: jsonData.link,
            expanded: false,
          },
        ]);
        setInput("");
      }
    } catch (e) {
      // If it's not valid JSON, keep the original text
      setInput(text);
    }
  }, []);

  const removePattern = useCallback((index: number) => {
    setPatterns((prevPatterns) => prevPatterns.filter((_, i) => i !== index));
  }, []);

  return { input, patterns, processInput, removePattern, setInput };
}
