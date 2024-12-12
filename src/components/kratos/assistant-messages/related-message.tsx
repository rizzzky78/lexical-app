import { RelatedQuery } from "@/lib/agents/schema/related-query";
import { FC } from "react";

interface RelatedMessageProps {
  relatedQueries: RelatedQuery;
}

export const RelatedMessage: FC<RelatedMessageProps> = ({ relatedQueries }) => {
  return (
    <div>
      <div>CONTENT</div>
    </div>
  );
};
