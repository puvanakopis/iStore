"use client";

import { motion, Variants } from "framer-motion";
import ProductCard from "./ProductCard";
import { products as allProducts } from "@/data/productData";

const products = allProducts.slice(0, 4).map(p => ({
  ...p,
  images: p.colors?.[0]?.images?.map(img => img.replace("./../public", "")) || [p.imageSrc.replace("./../public", "")],
  colors: p.colors?.map(color => ({
    ...color,
    images: color.images.map(img => img.replace("./../public", ""))
  }))
}));

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export default function FeaturedPhones() {
  return (
    <section
      id="shop"
      className="section-padding bg-background-dim"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24 px-6"
        >
          <h2 className="text-[32px] md:text-[64px] font-bold tracking-tight mb-6">
            Which iPhone is right for you?
          </h2>
          <p className="text-[17px] md:text-[21px] text-foreground-secondary font-light max-w-2xl mx-auto">
            Compare all the models and find the one that fits your lifestyle.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {products.map((product) => (
            <motion.div key={product.title} variants={itemVariants}>
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}