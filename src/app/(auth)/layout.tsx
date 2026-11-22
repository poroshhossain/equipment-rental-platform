import { CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";

import Navbar from "@/components/public/header/Navbar";

const highlights = [
  {
    icon: CalendarCheck,
    title: "Book in minutes",
    description: "Check availability and reserve equipment for any date range.",
  },
  {
    icon: ShieldCheck,
    title: "Verified equipment",
    description: "Every listing is inspected and backed by our damage guarantee.",
  },
  {
    icon: Sparkles,
    title: "Transparent pricing",
    description: "Daily, weekly and monthly rates with no hidden fees.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      {/* Subtle background texture — kept behind the content in both themes. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-40 -top-40 size-112 rounded-full bg-brand/15 blur-3xl" />
        <div className="absolute -bottom-40 right-0 size-120 rounded-full bg-success/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <Navbar />
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 lg:grid-cols-[1.05fr_1fr]">
        {/* Brand panel */}
        <aside className="relative hidden flex-col overflow-hidden rounded-r-[2.5rem] bg-primary p-10 text-primary-foreground lg:flex xl:p-12">
          <div className="flex flex-1 flex-col justify-center space-y-10 py-10">
            <div className="space-y-5">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground/80">
                <Sparkles className="size-3.5 text-success" />
                Trusted by 12,000+ renters
              </span>

              <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight xl:text-5xl">
                Rent the right gear.
                <br />
                <span className="text-success">Build without limits.</span>
              </h1>

              <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/65">
                Professional tools, cameras, and heavy equipment — reserved in
                minutes and delivered when you need them.
              </p>
            </div>

            <ul className="space-y-4">
              {highlights.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex gap-3.5">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-primary-foreground/10 bg-primary-foreground/10">
                    <Icon className="size-4 text-success" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground">
                      {title}
                    </p>
                    <p className="text-xs leading-relaxed text-primary-foreground/55">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/6 p-4">
            <div className="flex -space-x-2.5">
              <span className="size-8 rounded-full border-2 border-primary bg-brand" />
              <span className="size-8 rounded-full border-2 border-primary bg-success" />
              <span className="size-8 rounded-full border-2 border-primary bg-accent" />
            </div>
            <p className="text-xs leading-relaxed text-primary-foreground/65">
              <span className="font-semibold text-primary-foreground">4.9/5</span>{" "}
              average rating from verified rentals
            </p>
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex flex-col px-4 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
