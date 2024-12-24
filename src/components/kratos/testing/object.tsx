"use client";

import { StreamableValue, useStreamableValue } from "ai/rsc";
import { useEffect, useState } from "react";

interface ObjectStreamMessageProps {
  content: StreamableValue<object>;
}

export function ObjectStreamMessage({ content }: ObjectStreamMessageProps) {
  const [data] = useStreamableValue(content);
  const [streamData, setStreamData] = useState<object>({});

  useEffect(() => {
    if (data) setStreamData(data);
  }, [data]);

  return (
    <div>
      <div>
        <h2>Extracting RAW data from scrape data. Method: Stream</h2>
        <div>
          <pre className="text-xs overflow-x-auto">{JSON.stringify(streamData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

interface ObjectMessageProps {
  content: unknown;
}

export function ObjectMessage({ content }: ObjectMessageProps) {
  return (
    <div>
      <div>
        <h2>Extracting RAW data from scrape data. Method: object</h2>
        <div>
          <pre className="text-xs">{JSON.stringify(content, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
