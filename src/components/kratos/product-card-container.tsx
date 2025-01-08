"use client";

import { ProductsResponse } from "@/lib/types/general";
import { FC, useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import { motion } from "framer-motion";
import { ProductCardSkeleton } from "./skeleton-product-card";

// Animation configurations
const ANIMATION_CONSTANTS = {
  DELAY_MS: 1000,
  STAGGER_DELAY: 0.1,
  INITIAL_Y_OFFSET: 20,
  SKELETON_COUNT: 3,
} as const;

const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: ANIMATION_CONSTANTS.STAGGER_DELAY,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: ANIMATION_CONSTANTS.INITIAL_Y_OFFSET },
    visible: { opacity: 1, y: 0 },
  },
};

interface ProductGridProps {
  content: ProductsResponse;
  isFinished?: boolean;
}

export const ProductCardContainer: FC<ProductGridProps> = ({
  content,
  isFinished,
}) => {
  const [isContentReady, setIsContentReady] = useState(false);
  const products = content.data;

  useEffect(() => {
    const timer = setTimeout(
      () => setIsContentReady(true),
      ANIMATION_CONSTANTS.DELAY_MS
    );
    return () => clearTimeout(timer);
  }, []);

  const renderSkeletons = () =>
    Array.from({ length: ANIMATION_CONSTANTS.SKELETON_COUNT }).map((_, idx) => (
      <motion.div key={`skeleton-${idx}`} variants={animations.item}>
        <ProductCardSkeleton />
      </motion.div>
    ));

  const renderProducts = () =>
    products.map((product, index) => (
      <motion.div key={`product-${index}`} variants={animations.item}>
        <ProductCard product={product} isFinished={isFinished} id={index} />
      </motion.div>
    ));

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2"
      variants={animations.container}
      initial="hidden"
      animate="visible"
    >
      {isContentReady && isFinished ? renderProducts() : renderSkeletons()}
    </motion.div>
  );
};
