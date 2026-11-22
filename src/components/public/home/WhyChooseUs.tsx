import { BadgeCheck, CalendarRange, LockKeyhole, Tag } from "lucide-react";

const benefits = [
  {
    icon: Tag,
    title: "Affordable prices",
    text: "Compare daily, weekly and monthly rates so you only pay for what you use.",
  },
  {
    icon: BadgeCheck,
    title: "Verified owners",
    text: "Every owner is reviewed before their equipment goes live on the platform.",
  },
  {
    icon: CalendarRange,
    title: "Flexible periods",
    text: "Rent for a day, a week or a month, with clear terms and no hidden fees.",
  },
  {
    icon: LockKeyhole,
    title: "Secure payments",
    text: "Bookings and payments are recorded in one place for a clear paper trail.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 space-y-2 text-center">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">
          Why choose EquipRent
        </h2>
        <p className="text-sm text-muted-foreground">
          A simpler, safer way to get the gear you need.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <span className="mb-4 grid size-11 place-items-center rounded-lg bg-brand/10 text-brand">
              <Icon className="size-5" />
            </span>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
