import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

const getRules = (password: string) => [
  { label: "At least 6 characters", valid: password.length >= 6 },
  { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
  { label: "One lowercase letter", valid: /[a-z]/.test(password) },
];

export default function PasswordRequirements({
  password,
}: {
  password: string;
}) {
  return (
    <ul className="space-y-1">
      {getRules(password).map((rule) => (
        <li
          key={rule.label}
          className={cn(
            "flex items-center gap-1.5 text-xs",
            rule.valid ? "text-success" : "text-muted-foreground",
          )}
        >
          {rule.valid ? (
            <Check className="size-3.5" />
          ) : (
            <X className="size-3.5" />
          )}
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
