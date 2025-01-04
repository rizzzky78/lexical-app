import { ExtendedToolResult } from "@/lib/types/ai";
import { ReactNode } from "react";

interface ToolProps {
  args: object;
  children?: ReactNode;
}

export function SectionToolResult({ args, children }: ToolProps) {
  return (
    <div>
      <div>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify(args, null, 2)}
        </pre>
        <div className="py-3">{children}</div>
      </div>
    </div>
  );
}
