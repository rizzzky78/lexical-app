"use client";

import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Inquiry } from "@/lib/agents/schema/inquiry";

interface OptionItemProps {
  option: { value: string; label: string };
  type: "radio" | "checkbox";
  checked: boolean;
  onCheckedChange: () => void;
}

export function OptionItem({
  option,
  type,
  checked,
  onCheckedChange,
}: OptionItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center space-x-2 p-2 rounded-md shadow-sm"
    >
      {type === "radio" ? (
        <RadioGroupItem
          value={option.value}
          id={option.value}
          className="text-pastel-500"
        />
      ) : (
        <Checkbox
          id={option.value}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="text-pastel-500"
        />
      )}
      <Label
        htmlFor={option.value}
        className="flex-grow cursor-pointer text-pastel-700 font-medium"
      >
        {option.label}
      </Label>
    </motion.div>
  );
}

interface InquiryProps {
  data: Inquiry;
  onSubmit: (selectedOptions: string[], additionalInput?: string) => void;
}

export function InquiryUI({ data, onSubmit }: InquiryProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [additionalInput, setAdditionalInput] = useState("");

  const handleOptionChange = (value: string) => {
    if (data.type === "single") {
      setSelectedOptions([value]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(value)
          ? prev.filter((option) => option !== value)
          : [...prev, value]
      );
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedOptions, data.allowsInput ? additionalInput : undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-sm"
    >
      <Card className="w-full px-2 bg-red-500 border-none shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="text-sm font-bold text-foreground">
            {data.question}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Please select{" "}
            {data.type === "single" ? "an option" : "one or more options"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 px-0">
          {data.type === "single" ? (
            <RadioGroup
              onValueChange={(value) => setSelectedOptions([value])}
              value={selectedOptions[0]}
            >
              {data.options.map((option) => (
                <OptionItem
                  key={option.value}
                  option={option}
                  type="radio"
                  checked={selectedOptions.includes(option.value)}
                  onCheckedChange={() => handleOptionChange(option.value)}
                />
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-1">
              {data.options.map((option) => (
                <OptionItem
                  key={option.value}
                  option={option}
                  type="checkbox"
                  checked={selectedOptions.includes(option.value)}
                  onCheckedChange={() => handleOptionChange(option.value)}
                />
              ))}
            </div>
          )}
          {data.allowsInput && (
            <div className="space-y-2">
              <Label htmlFor="additionalInput" className="text-foreground">
                {data.inputLabel || "Additional Input"}
              </Label>
              <Input
                id="additionalInput"
                placeholder={
                  data.inputPlaceholder || "Enter additional information..."
                }
                value={additionalInput}
                onChange={(e) => setAdditionalInput(e.target.value)}
                className="bg-transparent border-b border-input focus:border-primary focus:ring-0 px-2 rounded-md"
              />
            </div>
          )}
          <div className="flex flex-row-reverse pt-1">
            <Button
              onClick={handleSubmit}
              variant={"outline"}
              className="w-fit"
              disabled={selectedOptions.length === 0}
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface CopilotInquiryProps {
  inquiry: Inquiry;
}

export function CopilotInquiry({ inquiry }: CopilotInquiryProps) {
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (
    selectedOptions: string[],
    additionalInput?: string
  ) => {
    const selected = selectedOptions.join(", ");
    const additional = additionalInput ? ` (Other: ${additionalInput})` : "";
    setResult(`You selected: ${selected}${additional}`);
  };

  return (
    <div>
      <InquiryUI data={inquiry} onSubmit={handleSubmit} />
      {result && (
        <div className="mt-4 p-4 bg-white rounded-md shadow text-pastel-800">
          {result}
        </div>
      )}
    </div>
  );
}
