"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

const Banner = () => {
  return (
    <section className="relative isolate overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80"
        alt="Construction equipment on a job site"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/30" />

      <div className="mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center gap-6 px-4 py-20 sm:px-6">
        <motion.div
          initial={{ y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            <Sparkles className="size-3.5" />
            Rent smarter, build faster
          </span>

          <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight text-foreground sm:text-6xl">
            The right equipment,{" "}
            <span className="text-brand">right when you need it.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            EquipRent connects you with verified equipment owners. Browse
            construction gear, cameras, vehicles and more — compare prices,
            book in minutes and pay securely.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/equipments" className={buttonVariants({ variant: "brand", size: "lg" })}>
              Browse equipment
              <ArrowRight />
            </Link>
            <Link href="/#how-it-works" className={buttonVariants({ variant: "outline", size: "lg" })}>
              How it works
            </Link>
          </div>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-brand" />
            Verified owners · Flexible rental periods · Secure payments
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
