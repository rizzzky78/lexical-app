"use client";

import dynamic from "next/dynamic";
import { FC } from "react";

const ShiningGlassText = dynamic(
  () => import("@/components/kratos/custom/shining-glass"),
  { ssr: false }
);

interface Props {
  text: string;
  disabled: boolean;
  speed: number;
  className: string;
}

const ShinyText: FC<Props> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`text-[#b5b5b5a4] bg-clip-text inline-block ${
        disabled ? "" : "animate-shine"
      } ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};

export default function Home() {
  return (
    <main>
      <ShinyText
        text="Hello World"
        disabled={false}
        speed={3}
        className="text-4xl"
      />
    </main>
  );
}
