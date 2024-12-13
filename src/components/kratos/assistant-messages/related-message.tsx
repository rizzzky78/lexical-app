"use client";

import {
  PartialRelated,
  RelatedQuery,
} from "@/lib/agents/schema/related-query";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { FC, useEffect, useState } from "react";

interface RelatedMessageProps {
  related: StreamableValue<PartialRelated>;
}

export const RelatedMessage: FC<RelatedMessageProps> = ({ related }) => {
  const [data, error, pending] = useStreamableValue(related);
  const [relatedQuery, setRelatedQuery] = useState<PartialRelated>();

  useEffect(() => {
    if (data) setRelatedQuery(data);
  }, [data]);

  return (
    <div className="bg-gray-500 py-5">
      {Array.isArray(relatedQuery?.items) ? (
        relatedQuery.items
          .filter((r) => r?.query !== "")
          .map((item, index) => (
            <div key={index}>
              <p className="text-sm">{item?.query}</p>
            </div>
          ))
      ) : (
        <div> Not an array</div>
      )}
    </div>
  );
};
