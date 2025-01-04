import { ToolCallPart } from "ai";

interface ToolCallProps {
  data: ToolCallPart;
}

export function ToolCallMessage({ data }: ToolCallProps) {
  return (
    <div>
      <div>
        <h2>{data.toolName}XX</h2>
        <div>
          <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
