import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 size-112 rounded-full bg-brand/25 blur-3xl" />
        <div className="absolute -bottom-40 right-0 size-120 rounded-full bg-success/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[1.05fr_1fr]">
        {/* Brand panel */}
        <aside className="relative hidden overflow-hidden rounded-r-[2.5rem] bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="relative flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-brand text-brand-foreground">
              <Boxes className="size-6" />
            </span>
            <span className="font-heading text-lg font-extrabold tracking-tight">
              Equip<span className="text-success">Rent</span>
            </span>
          </div>

          <div className="relative space-y-10">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground/80">
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

          <div className="relative flex items-center gap-4 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/6 p-4">
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
        <main className="flex min-h-screen flex-col px-4 py-6 sm:px-8 lg:py-10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </Link>

            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <span className="grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground">
                <Boxes className="size-4" />
              </span>
              <span className="font-heading text-sm font-extrabold">
                Equip<span className="text-brand">Rent</span>
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
