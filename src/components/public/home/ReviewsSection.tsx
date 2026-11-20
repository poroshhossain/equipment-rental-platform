"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import type { Review } from "@/lib/types";

export default function ReviewsSection({ items }: { items: Review[] }) {
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
            What renters say
          </h2>
          <p className="text-sm text-muted-foreground">
            Real experiences from people who rented through EquipRent.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((review, index) => (
            <motion.figure
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star
                    key={star}
                    className={`size-4 ${
                      star < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                “{review.comment}”
              </blockquote>
              <figcaption>
                <p className="text-sm font-semibold">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
