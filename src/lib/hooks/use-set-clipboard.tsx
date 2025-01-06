"use client";

import { create } from "zustand";

type ClipboardState = {
  clipboard: string;
  setClipboard: (clip: string) => void;
};

export const useSetClipboard = create<ClipboardState>((setter) => ({
  clipboard: "",
  setClipboard: (clip) => setter({ clipboard: clip }),
}));
