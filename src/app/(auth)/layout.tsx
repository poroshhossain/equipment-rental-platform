import Header from "@/components/public/header/Header";
import { Check, Zap } from "lucide-react";

const benefits = [
  "Verified, well-maintained equipment",
  "Flexible daily, weekly and monthly rentals",
  "Clear pricing with no hidden fees",
];

const stats = [
  { value: "12k+", label: "Bookings this year" },
  { value: "4.9/5", label: "Average rating" },
  { value: "48h", label: "Delivery window" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <Header />

      <main>
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:py-10">
          {/* Brand panel */}
          <aside className="flex flex-col justify-between rounded-3xl bg-primary px-6 py-8 text-primary-foreground sm:px-10 sm:py-12">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                <Zap className="size-3.5" />
                Trusted by 12,000+ renters
              </span>

              <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">
                Rent the right gear{" "}
                <span className="text-brand">for any job.</span>
              </h1>

              <p className="max-w-md text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
                Professional tools and equipment, booked online and ready when
                you need them.
              </p>

              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                      <Check className="size-3" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden gap-8 border-t border-primary-foreground/10 pt-6 sm:flex">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-primary-foreground/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          {/* Form panel */}
          <section className="flex items-center justify-center">
            <div className="w-full max-w-md">{children}</div>
          </section>
        </div>
      </main>
    </div>
  );
}
