"use client";

import { ChangeEvent } from "react";
import { create } from "zustand";

type Attachment = {
  meta: {
    id: string | number;
    title: string;
    link: string;
  };
};

interface SmartTextareaState {
  /**
   * The text area regular input
   */
  input: string;
  setInput: (text: string) => void;
  /**
   * Change Event from TextArea Element
   * @param input
   */
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * Attached Value
   */
  attachment: Partial<Attachment>;
  /**
   * Attach an serializable object
   * @param object
   * @returns
   */
  attach: (object: Partial<Attachment>) => void;
  /**
   * Detach or remove value of `attachment`
   */
  detach: () => void;
  /**
   * Flush or Reset value for both of `input` and `attachment`
   */
  flush: () => void;
}

/**
 * Use Smart TextArea Hook
 *
 * This hook should be used on component of:
 * - who need to maintain/change state in different component or pages
 * - to get state data in anywhere as well as in client component
 */
export const useSmartTextarea = create<SmartTextareaState>((set) => ({
  input: "",
  setInput: (text) => set({ input: text }),
  attachment: {},
  onChange: (e) => set({ input: e.target.value }),
  attach: (value) => set({ attachment: value }),
  detach: () => set({ attachment: {} }),
  flush: () => set({ input: "", attachment: {} }),
}));
