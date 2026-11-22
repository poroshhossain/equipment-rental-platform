"use client";

import { motion } from "framer-motion";
import { CalendarCheck, Search, Wallet } from "lucide-react";

import EquipmentCard from "./EquipmentCard";
import type { Equipment } from "@/lib/types";

function EquipmentRow({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Equipment[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ y: 16 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 space-y-2"
      >
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </motion.div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No equipment to show yet.
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

export function PopularEquipment({ items }: { items: Equipment[] }) {
  return (
    <EquipmentRow
      title="Popular equipment"
      description="The gear renters book most often."
      items={items}
    />
  );
}

export function RecentlyAdded({ items }: { items: Equipment[] }) {
  return (
    <EquipmentRow
      title="Recently added"
      description="Fresh listings from verified owners."
      items={items}
    />
  );
}

const steps = [
  {
    icon: Search,
    title: "Find your gear",
    text: "Browse approved listings, compare rates and check availability.",
  },
  {
    icon: CalendarCheck,
    title: "Book your dates",
    text: "Choose the rental period and quantity, then confirm in one click.",
  },
  {
    icon: Wallet,
    title: "Pay and pick up",
    text: "Review the total, complete payment and arrange pickup with the owner.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-card py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ y: 16 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 space-y-2 text-center"
        >
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            How it works
          </h2>
          <p className="text-sm text-muted-foreground">
            Three steps between you and the equipment you need.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl border border-border bg-background p-6 text-center"
            >
              <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-brand/10 text-brand">
                <Icon className="size-5" />
              </span>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
