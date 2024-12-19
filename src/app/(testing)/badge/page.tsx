"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";

interface BadgeOption {
  id: string;
  label: string;
  color: string;
}

const badgeOptions: BadgeOption[] = [
  { id: "1", label: "Specifications", color: "bg-red-200" },
  { id: "2", label: "Available Type", color: "bg-yellow-200" },
  { id: "3", label: "Quality", color: "bg-green-200" },
  { id: "4", label: "Materials Used", color: "bg-blue-200" },
];

function FlexibleBadgeSelector() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id)
        ? prev.filter((optionId) => optionId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const selectedLabels = badgeOptions
      .filter((option) => selectedOptions.includes(option.id))
      .map((option) => option.label);

    const submission = {
      selectedBadges: selectedLabels,
      customInput: customInput ?? null,
    };

    setSubmitted(true);

    console.log("Submitted:", submission);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-5 space-y-3 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-md shadow-xl"
    >
      <h2 className="text-sm font-semibold mb-4 dark:text-white">
        What information do you want from this product?
      </h2>
      <motion.div
        className="flex flex-wrap gap-2"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {badgeOptions.map((option) => (
          <motion.div
            key={option.id}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              show: { opacity: 1, scale: 1 },
            }}
          >
            <Button
              onClick={() => toggleOption(option.id)}
              variant={"default"}
              className={`rounded-full h-7 text-sm border-transparent transition-colors duration-200 ${
                selectedOptions.includes(option.id)
                  ? `${option.color} text-black`
                  : "bg-muted-foreground opacity-80 text-white hover:bg-opacity-30"
              }`}
            >
              {option.label}
            </Button>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Input
          type="text"
          placeholder="Is there anything else?"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="dark:text-white h-8 border-black dark:border-muted-foreground border-opacity-20 focus:border-opacity-50 rounded-full placeholder-gray-300"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={handleSubmit}
          variant={"outline"}
          disabled={submitted}
          className="w-fit text-primary font-semibold h-8 px-5 rounded-full bg-black dark:bg-white text-white dark:text-black dark:hover:bg-muted-foreground"
        >
          Submit <SendHorizonal />
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <FlexibleBadgeSelector />
    </main>
  );
}
