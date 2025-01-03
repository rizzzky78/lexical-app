"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  MapPin,
  ShieldCheck,
  Store,
  BadgeDollarSign,
  Package,
  CircleArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/general";
import { motion } from "framer-motion";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { useAppState } from "@/lib/utility/provider/app-state";
import { useActions, useUIState } from "ai/rsc";
import { AI } from "@/app/(server-action)/action-single";
import { useState, ReactNode, useId } from "react";
import { Message } from "./testing/message";
import { generateId } from "ai";

interface ProductCardProps {
  product: Partial<Product>;
  isFinished?: boolean;
}

export function ProductCard({ product, isFinished }: ProductCardProps) {
  const { isGenerating, setIsGenerating } = useAppState();
  const { sendMessage } = useActions<typeof AI>();
  const [uiState, setUIState] = useUIState<typeof AI>();

  const [messages, setMessages] = useState<ReactNode[]>([]);

  const id = useId();

  const handleActionSubmit = async (action: string) => {
    setIsGenerating(true);

    setUIState((messages) => [
      ...messages,
      {
        id: generateId(),
        display: (
          <Message key={messages.length} role="user">
            {action}
          </Message>
        ),
      },
    ]);

    const f = new FormData();
    f.append("text_input", action);

    const { id, display } = await sendMessage(f);

    setUIState((messages) => [...messages, { id, display }]);

    setIsGenerating(false);
  };

  const { title, image, price, rating, sold, link, store } = product;

  const fallbackImgUrl = `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="w-full mx-auto"
      variants={cardVariants}
      whileHover="hover"
    >
      <Card className="overflow-hidden border border-[#1A1A1D] bg-[#1A1A1D] text-green-50 h-full flex flex-col rounded-xl">
        <CardContent className="p-0 flex-grow relative">
          {image && (
            <Image
              src={isFinished ? image : fallbackImgUrl}
              alt={title || "Product image"}
              width={280}
              height={280}
              className="w-full h-40 object-cover"
            />
          )}
          <motion.div
            className="absolute top-2 right-2 bg-black p-1 rounded-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ShieldCheck
              className={`w-5 h-5 ${
                store?.isOfficial ? "text-green-500" : "text-gray-400"
              }`}
            />
          </motion.div>
          <div className="px-3 py-2 space-y-1 text-xs">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <h3 className="line-clamp-2 text-sm font-semibold">
                    {title || "Untitled Product"}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-sm font-semibold">{title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center">
              <BadgeDollarSign className="w-3 h-3 text-green-400 mr-1" />
              <span className="font-bold">{price ?? "-"}</span>
            </div>
            <div className="flex items-center space-x-1 *:text-xs">
              <div className="flex items-center">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                <p>{rating ?? "-"}</p>
              </div>
              <div>|</div>
              <div className="flex items-center">
                <p className="mr-1">sold</p>
                <Package className="w-3 h-3 text-purple-400" />
                <p className="ml-1 text-gray-300">{sold ?? "-"}</p>
              </div>
            </div>
          </div>
          <div className="px-3 py-2 text-xs rounded-xl">
            <div className="flex items-start">
              <Store className="w-3 h-3 mr-1 mt-[1px]" />
              <span className="line-clamp-1">{store?.name ?? "-"}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="w-3 h-3 mr-1 mt-[1px]" />
              <span>{store?.location ?? "-"}</span>
            </div>
          </div>
          <div className="px-2 space-x-2 pb-3 flex *:text-xs items-center justify-between pt-2">
            <Button
              className="relative ml-2 h-7 w-full overflow-hidden rounded-lg px-6 font-bold bg-gray-300 text-black shadow-sm transition-all duration-300 hover:bg-blue-200 hover:text-indigo-900"
              onClick={async () => await handleActionSubmit(link!)}
              disabled={isGenerating}
            >
              <span className="relative z-10">Ask AI</span>
              <div
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="gradient-bg bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-400 rounded-full w-40 h-40 blur-xl opacity-50 animate-spin-slow transition-all duration-300" />
              </div>
            </Button>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Link
                    href={link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex rounded-full h-7 pr-2 items-center"
                  >
                    <CircleArrowRight className="text-purple-200 h-7 w-7" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-sm font-semibold">Go to product page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
