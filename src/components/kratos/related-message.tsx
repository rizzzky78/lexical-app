"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Section } from "lucide-react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { PartialRelated } from "@/lib/agents/schema/related-query";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export interface SearchRelatedProps {
  relatedQueries: StreamableValue<PartialRelated>;
}

export const RelatedMessage: React.FC<SearchRelatedProps> = ({
  relatedQueries,
}) => {
  const [data, error, pending] = useStreamableValue(relatedQueries);
  const [related, setRelated] = useState<PartialRelated>();

  useEffect(() => {
    if (data) setRelated(data);
  }, [data]);

  return related ? (
    <form
      className={cn(
        "flex flex-wrap p-6 rounded-xl bg-[#1A1A1D]",
        pending ? "animate-pulse" : ""
      )}
    >
      {Array.isArray(related.items)
        ? related.items
            ?.filter((item) => item?.query !== "")
            .map((item, index) => (
              <div className="flex items-start w-full" key={index}>
                <ArrowRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-accent-foreground/50" />
                <Button
                  variant="link"
                  className="flex-1 text-sm justify-start px-0 py-1 h-fit text-white whitespace-normal text-left"
                  type="submit"
                  name={"related_query"}
                  value={item?.query}
                >
                  {item?.query}
                </Button>
              </div>
            ))
        : null}
    </form>
  ) : error ? null : (
    <Skeleton className="w-full h-6" />
  );
};
