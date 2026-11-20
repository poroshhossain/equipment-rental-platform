"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  Construction,
  Laptop,
  Music2,
  Tractor,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { CATEGORY_BY_SLUG, type Category } from "@/lib/types";

const icons: Record<string, LucideIcon> = {
  construction: Construction,
  camera: Camera,
  transport: Truck,
  tractor: Tractor,
  laptop: Laptop,
  music: Music2,
};

export default function CategoriesSection({ items }: { items: Category[] }) {
  return (
    <section className="bg-secondary/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 space-y-2 text-center"
        >
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Browse by category
          </h2>
          <p className="text-sm text-muted-foreground">
            Whatever the job, there is equipment for it.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {items.map((category, index) => {
            const Icon = icons[category.icon] ?? Construction;
            const href = `/equipments?category=${encodeURIComponent(
              CATEGORY_BY_SLUG[category.slug] ?? category.name,
            )}`;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <Link
                  href={href}
                  className="flex h-full flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center shadow-sm transition-colors hover:border-brand/40 hover:bg-brand/5"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
