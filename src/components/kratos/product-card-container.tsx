"use client";

import { ProductsResponse } from "@/lib/types/general";
import { FC } from "react";
import { ProductCard } from "./product-card";
import { motion } from "framer-motion";
import { ProductCardSkeleton } from "./skeleton-product-card";

interface ProductCardContainerProps {
  content: ProductsResponse;
  isFinished?: boolean;
}

export const ProductCardContainer: FC<ProductCardContainerProps> = ({
  content,
  isFinished,
}) => {
  const products = content.data;
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isFinished
          ? products.map((product, index) => (
              <motion.div key={`product-${index}`} variants={itemVariants}>
                <ProductCard product={product} isFinished={isFinished} />
              </motion.div>
            ))
          : Array.from({ length: 6 }).map((_, idx) => (
              <motion.div key={`product-${idx}`} variants={itemVariants}>
                <ProductCardSkeleton />
              </motion.div>
            ))}
      </motion.div>
    </div>
  );
};

// interface ProductCardContainerPropsStream {
//   content: StreamableValue<PartialProductsResponse>;
// }

// const MAX_PRODUCTS = 6;

// export const ProductCardContainerStream: FC<
//   ProductCardContainerPropsStream
// > = ({ content }) => {
//   const [data, error, pending] = useStreamableValue(content);
//   const [products, setProducts] = useState<PartialProductsResponse>({
//     data: [],
//   });

//   useEffect(() => {
//     if (data) {
//       setProducts((prevProducts) => ({
//         data: [...(prevProducts.data || []), ...(data.data || [])],
//       }));
//     }
//   }, [data]);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   };

//   if (error) {
//     return (
//       <div className="text-center text-red-500 p-4">
//         An error occurred while fetching products. Please try again later.
//       </div>
//     );
//   }

//   const renderProducts = () => {
//     const loadedProducts = products.data || [];
//     const skeletonCount = Math.max(0, MAX_PRODUCTS - loadedProducts.length);

//     return (
//       <>
//         {loadedProducts.map((product, index) => (
//           <motion.div key={`product-${index}`} variants={itemVariants}>
//             <ProductCard product={product as Product} />
//           </motion.div>
//         ))}
//         {pending &&
//           Array.from({ length: skeletonCount }).map((_, index) => (
//             <motion.div key={`skeleton-${index}`} variants={itemVariants}>
//               <ProductCardSkeleton />
//             </motion.div>
//           ))}
//       </>
//     );
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {products.data && products.data.length > 0 ? (
//           renderProducts()
//         ) : pending ? (
//           Array.from({ length: MAX_PRODUCTS }).map((_, index) => (
//             <motion.div
//               key={`initial-skeleton-${index}`}
//               variants={itemVariants}
//             >
//               <ProductCardSkeleton />
//             </motion.div>
//           ))
//         ) : (
//           <div className="col-span-full text-center p-4">
//             No products found. Try adjusting your search criteria.
//           </div>
//         )}
//       </motion.div>
//     </AnimatePresence>
//   );
// };
