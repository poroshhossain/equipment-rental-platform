"use client";

import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRecordDetails } from "./RecordDetailsProvider";

/** Opens a sheet showing every field stored on a record, including nested objects. */
export default function RecordDetails({
  record,
  title = "Record details",
  asMenu = false,
  label = "View details",
}: {
  record: object;
  title?: string;
  /** Render as a dropdown menu item instead of a standalone icon button. */
  asMenu?: boolean;
  label?: string;
}) {
  const { showDetails } = useRecordDetails();
  const open = () => showDetails({ record, title });

  if (asMenu) {
    return (
      <DropdownMenuItem onClick={open}>
        <Eye />
        {label}
      </DropdownMenuItem>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="View all fields"
      onClick={open}
    >
      <Eye />
    </Button>
  );
}
