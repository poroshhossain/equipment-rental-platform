"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import EquipmentCard from "./EquipmentCard";
import type { Equipment } from "@/lib/types";

export default function FeaturedEquipment({ items }: { items: Equipment[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ y: 16 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-wrap items-end justify-between gap-3"
      >
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Featured equipment
          </h2>
          <p className="text-sm text-muted-foreground">
            Approved listings ready for your next project.
          </p>
        </div>
        <Link
          href="/equipments"
          className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
        >
          View all equipment
          <ArrowRight className="size-4" />
        </Link>
      </motion.div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No featured equipment yet. Check back soon.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      )}
    </section>
  );
}
