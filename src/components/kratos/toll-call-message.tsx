import { ToolCallPart } from "ai";

interface ToolCallProps {
  data: ToolCallPart;
}

export function ToolCallMessage({ data }: ToolCallProps) {
  return (
    <div>
      <div className="bg-muted p-5 my-5 rounded-3xl">
        <h2>{data.toolName}</h2>
        <div>
          <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
