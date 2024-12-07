import { SquareArrowOutUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LinkWithTooltip({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href} //8x12
            className="no-underline font-normal text-black align-super ml-[-3] hover:text-primary text-[8px] sm:text-[11px] md:text-[11px]"
            target="_blank"
            rel="noopener noreferrer"
          >
            [{children}]
          </a>
        </TooltipTrigger>
        <TooltipContent side="top" className="flex items-center gap-2">
          <SquareArrowOutUpRight className="h-4 w-4" />
          <span>{href.slice(0, 50) + "..."}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
