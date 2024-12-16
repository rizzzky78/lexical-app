import { MessageProperty } from "@/lib/types/ai";
import { FC } from "react";

type DebugMessageProps = {
  source: any;
  data: any;
};

export const DebugMessage: FC<DebugMessageProps> = ({ source, data }) => {
  return (
    <div>
      <h2>Source: {source}</h2>
      <div className="overflow-x-auto">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};
