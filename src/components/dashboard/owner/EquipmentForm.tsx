"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  ClipboardList,
  ImagePlus,
  Info,
  Lightbulb,
  Loader2,
  MapPin,
  Save,
  Tag,
  Trash2,
  UploadCloud,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  CONDITION_OPTIONS,
  EQUIPMENT_CATEGORIES,
  RENTAL_TYPE_OPTIONS,
  conditionLabels,
  equipmentStatusMeta,
  fakeOwner,
  rentalTypeLabels,
  type Equipment,
} from "@/lib/owner-data";
import { cn } from "@/lib/utils";

const equipmentFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Equipment name must be at least 3 characters.")
    .max(80, "Equipment name is too long."),
  description: z
    .string()
    .trim()
    .min(20, "Describe the equipment in at least 20 characters.")
    .max(1200, "Description is too long."),
  category: z.string().min(1, "Select a category."),
  location: z.string().trim().min(2, "Enter a pickup location."),
  rentalPrice: z
    .string()
    .trim()
    .min(1, "Enter a rental price.")
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) > 0,
      "Enter a price greater than 0.",
    ),
  rentalType: z.enum(["daily", "weekly", "monthly"]),
  availableQuantity: z
    .string()
    .trim()
    .min(1, "Enter available quantity.")
    .refine(
      (value) =>
        Number.isInteger(Number(value)) && Number(value) > 0 && Number(value) <= 999,
      "Enter a whole number between 1 and 999.",
    ),
  condition: z.enum(["new", "excellent", "good", "fair"]),
  brand: z.string().trim().min(1, "Enter the brand."),
  model: z.string().trim().min(1, "Enter the model."),
  image: z.string().trim().min(1, "Add at least one equipment image."),
  terms: z
    .string()
    .trim()
    .min(20, "Add rental terms of at least 20 characters.")
    .max(2000, "Terms are too long."),
});

export type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;

interface EquipmentFormProps {
  equipment?: Equipment;
}

const categoryOptions = EQUIPMENT_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));

const conditionSelectOptions = CONDITION_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}));

function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
        {hint ? (
          <span className="text-[11px] text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function EquipmentImageField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    setPreviewFailed(false);
    setFileName(file.name);
    onChange(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setFileName("");
    setPreviewFailed(false);
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFile(event.dataTransfer.files[0]);
        }}
        className={cn(
          "relative grid min-h-44 place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-center transition-colors",
          isDragging && "border-brand bg-brand/5",
          error && "border-destructive/60",
        )}
      >
        {value && !previewFailed ? (
          <div className="group relative w-full overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Equipment preview"
              className="max-h-56 w-full object-cover"
              onError={() => setPreviewFailed(true)}
            />
            <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/60 via-black/0 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="truncate rounded bg-black/50 px-2 py-1 text-[11px] font-medium text-white">
                {fileName || "Linked image"}
              </span>
              <Button
                type="button"
                size="icon-sm"
                variant="destructive"
                aria-label="Remove image"
                onClick={clearImage}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg px-4 py-8 text-center"
          >
            <span className="grid size-11 place-items-center rounded-full bg-brand/10 text-brand">
              <UploadCloud className="size-5" />
            </span>
            <span className="text-sm font-medium">
              Drop an image here or click to upload
            </span>
            <span className="text-xs text-muted-foreground">
              JPG, PNG or WEBP · up to 5 MB
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="url"
          placeholder="Or paste an image URL"
          value={value.startsWith("blob:") ? "" : value}
          onChange={(event) => {
            setFileName("");
            setPreviewFailed(false);
            onChange(event.target.value);
          }}
          className="h-9"
          aria-invalid={Boolean(error)}
        />
        {value ? (
          <Button type="button" size="sm" variant="ghost" onClick={clearImage}>
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default function EquipmentForm({ equipment }: EquipmentFormProps) {
  const router = useRouter();
  const isEditing = Boolean(equipment);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      name: equipment?.name ?? "",
      description: equipment?.description ?? "",
      category: equipment?.category ?? "",
      location: equipment?.location ?? "",
      rentalPrice: equipment ? String(equipment.rentalPrice) : "",
      rentalType: equipment?.rentalType ?? "daily",
      availableQuantity: equipment ? String(equipment.availableQuantity) : "1",
      condition: equipment?.condition ?? "excellent",
      brand: equipment?.brand ?? "",
      model: equipment?.model ?? "",
      image: equipment?.image ?? "",
      terms: equipment?.terms ?? "",
    },
  });

  const rentalType = useWatch({ control, name: "rentalType" });
  const condition = useWatch({ control, name: "condition" });
  const rentalPrice = useWatch({ control, name: "rentalPrice" });
  const availableQuantity = useWatch({ control, name: "availableQuantity" });
  const description = useWatch({ control, name: "description" });
  const status = equipment?.status ?? "pending";
  const statusMeta = equipmentStatusMeta[status];

  const onSubmit = async (values: EquipmentFormValues) => {
    // TODO: replace with `POST /api/owner/equipment` or `PATCH /api/owner/equipment/:id`.
    const payload = {
      ...values,
      rentalPrice: Number(values.rentalPrice),
      availableQuantity: Number(values.availableQuantity),
      owner: fakeOwner,
      status: "pending" as const,
    };

    await new Promise((resolve) => setTimeout(resolve, 700));
    console.info("Equipment payload", payload);

    toast.success(
      isEditing
        ? "Equipment updated successfully."
        : "Equipment submitted for review.",
      {
        description: isEditing
          ? "Your changes are live. Admin approval may be required for critical edits."
          : "Our team will review it within 24–48 hours.",
      },
    );

    router.push("/dashboard/my-equipment");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div className="space-y-5">
        <PageHeader
          eyebrow="Owner dashboard"
          title={isEditing ? "Update equipment" : "Add equipment"}
          description={
            isEditing
              ? "Keep your listing accurate so renters know exactly what to expect."
              : "List a new item for rent. Your listing goes live after a quick admin review."
          }
          actions={
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/dashboard/my-equipment" />}
            >
              <ArrowLeft />
              Back to my equipment
            </Button>
          }
        />

        <Card className="gap-0 overflow-hidden">
          <CardHeader className="gap-1 border-b border-border/70 pb-5">
            <div className="flex items-center gap-2 text-brand">
              <span className="grid size-8 place-items-center rounded-lg bg-brand/10">
                <Boxes className="size-4" />
              </span>
              <CardTitle className="text-base">Equipment details</CardTitle>
            </div>
            <CardDescription>
              Describe the item clearly so renters can find it quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 sm:grid-cols-2">
            <Field
              label="Equipment name"
              htmlFor="name"
              required
              error={errors.name?.message}
              className="sm:col-span-2"
            >
              <Input
                id="name"
                placeholder="e.g. CAT 320 Excavator"
                className="h-9"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
            </Field>

            <Field
              label="Description"
              htmlFor="description"
              required
              hint={`${description.length}/1200`}
              error={errors.description?.message}
              className="sm:col-span-2"
            >
              <Textarea
                id="description"
                placeholder="What is included? What jobs is it best for?"
                className="min-h-28"
                aria-invalid={Boolean(errors.description)}
                {...register("description")}
              />
            </Field>

            <Controller
              control={control}
              name="category"
              render={({ field, fieldState }) => (
                <Field
                  label="Category"
                  htmlFor="category"
                  required
                  error={fieldState.error?.message}
                >
                  <Select
                    items={categoryOptions}
                    value={field.value || null}
                    onValueChange={(value) => field.onChange(value ?? "")}
                  >
                    <SelectTrigger
                      id="category"
                      className="h-9 w-full"
                      aria-invalid={Boolean(fieldState.error)}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUIPMENT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="condition"
              render={({ field, fieldState }) => (
                <Field
                  label="Condition"
                  htmlFor="condition"
                  required
                  error={fieldState.error?.message}
                >
                  <Select
                    items={conditionSelectOptions}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value ?? "")}
                  >
                    <SelectTrigger
                      id="condition"
                      className="h-9 w-full"
                      aria-invalid={Boolean(fieldState.error)}
                    >
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Field
              label="Brand"
              htmlFor="brand"
              required
              error={errors.brand?.message}
            >
              <Input
                id="brand"
                placeholder="e.g. Caterpillar"
                className="h-9"
                aria-invalid={Boolean(errors.brand)}
                {...register("brand")}
              />
            </Field>

            <Field
              label="Model"
              htmlFor="model"
              required
              error={errors.model?.message}
            >
              <Input
                id="model"
                placeholder="e.g. 320 GC"
                className="h-9"
                aria-invalid={Boolean(errors.model)}
                {...register("model")}
              />
            </Field>
          </CardContent>
        </Card>

        <Card className="gap-0 overflow-hidden">
          <CardHeader className="gap-1 border-b border-border/70 pb-5">
            <div className="flex items-center gap-2 text-brand">
              <span className="grid size-8 place-items-center rounded-lg bg-brand/10">
                <Tag className="size-4" />
              </span>
              <CardTitle className="text-base">Rental details</CardTitle>
            </div>
            <CardDescription>
              Set pricing, availability and pickup information.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 sm:grid-cols-2">
            <Field
              label="Pickup location"
              htmlFor="location"
              required
              error={errors.location?.message}
            >
              <Input
                id="location"
                placeholder="City, State"
                className="h-9"
                aria-invalid={Boolean(errors.location)}
                {...register("location")}
              />
            </Field>

            <Field
              label="Rental price (USD)"
              htmlFor="rentalPrice"
              required
              hint={`per ${rentalType === "daily" ? "day" : rentalType === "weekly" ? "week" : "month"}`}
              error={errors.rentalPrice?.message}
            >
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="rentalPrice"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="0"
                  className="h-9 pl-6"
                  aria-invalid={Boolean(errors.rentalPrice)}
                  {...register("rentalPrice")}
                />
              </div>
            </Field>

            <Field
              label="Available quantity"
              htmlFor="availableQuantity"
              required
              error={errors.availableQuantity?.message}
            >
              <Input
                id="availableQuantity"
                type="number"
                min={1}
                step={1}
                className="h-9"
                aria-invalid={Boolean(errors.availableQuantity)}
                {...register("availableQuantity")}
              />
            </Field>

            <div className="space-y-2 sm:col-span-2">
              <Label>Rental type</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {RENTAL_TYPE_OPTIONS.map((option) => {
                  const isSelected = rentalType === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setValue("rentalType", option.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      aria-pressed={isSelected}
                      className={cn(
                        "flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left transition-colors",
                        isSelected
                          ? "border-brand bg-brand/5 ring-1 ring-brand/30"
                          : "border-border hover:border-brand/40 hover:bg-secondary/60",
                      )}
                    >
                      <span className="flex w-full items-center justify-between text-sm font-medium">
                        {option.label}
                        {isSelected ? (
                          <CheckCircle2 className="size-4 text-brand" />
                        ) : null}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {option.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FieldError message={errors.rentalType?.message} />
            </div>

            <div className="rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground sm:col-span-2">
              <span className="font-medium text-foreground">Preview: </span>
              Your item will show as{" "}
              <span className="font-semibold text-brand">
                ${rentalPrice || "0"} / {rentalTypeLabels[rentalType]}
              </span>{" "}
              with {availableQuantity || "0"} unit(s) available.
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 overflow-hidden">
          <CardHeader className="gap-1 border-b border-border/70 pb-5">
            <div className="flex items-center gap-2 text-brand">
              <span className="grid size-8 place-items-center rounded-lg bg-brand/10">
                <ImagePlus className="size-4" />
              </span>
              <CardTitle className="text-base">Photo & terms</CardTitle>
            </div>
            <CardDescription>
              A clear photo and fair terms build trust with renters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <Controller
              control={control}
              name="image"
              render={({ field, fieldState }) => (
                <Field
                  label="Equipment image"
                  required
                  error={fieldState.error?.message}
                >
                  <EquipmentImageField
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                </Field>
              )}
            />

            <Field
              label="Rental terms and conditions"
              htmlFor="terms"
              required
              error={errors.terms?.message}
            >
              <Textarea
                id="terms"
                placeholder="Deposits, delivery fees, fuel policy, late returns…"
                className="min-h-24"
                aria-invalid={Boolean(errors.terms)}
                {...register("terms")}
              />
            </Field>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/dashboard/my-equipment" />}
          >
            Cancel
          </Button>
          <Button type="submit" variant="brand" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save />
            )}
            {isSubmitting
              ? "Saving…"
              : isEditing
                ? "Save changes"
                : "Submit for review"}
          </Button>
        </div>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-20">
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="text-base">Listing status</CardTitle>
            <CardDescription>
              New listings are reviewed before they go public.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <p className="flex items-start gap-2">
                <ClipboardList className="mt-0.5 size-3.5 shrink-0 text-brand" />
                Admin review usually takes 24–48 hours.
              </p>
              <p className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-brand" />
                You can edit details while a listing is pending.
              </p>
              <p className="flex items-start gap-2">
                <Wrench className="mt-0.5 size-3.5 shrink-0 text-brand" />
                Equipment condition: {conditionLabels[condition]}.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="text-base">Owner information</CardTitle>
            <CardDescription>Shown to renters after booking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fakeOwner.avatar}
                alt={fakeOwner.name}
                className="size-10 rounded-full object-cover ring-2 ring-brand/15"
              />
              <div className="min-w-0">
                <p className="truncate font-medium">{fakeOwner.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {fakeOwner.company}
                </p>
              </div>
            </div>
            <div className="space-y-2 border-t border-border/70 pt-3 text-muted-foreground">
              <p className="flex items-center gap-2 text-xs">
                <MapPin className="size-3.5 shrink-0" />
                {fakeOwner.location}
              </p>
              <p className="truncate text-xs">{fakeOwner.email}</p>
              <p className="text-xs">{fakeOwner.phone}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              nativeButton={false}
              render={<Link href="/dashboard/my-profile" />}
            >
              Update owner profile
            </Button>
          </CardContent>
        </Card>

        <Card className="gap-2 border-brand/20 bg-brand/5">
          <CardContent className="flex gap-3 pt-6">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-brand" />
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-foreground">Listing tip</p>
              <p className="text-muted-foreground">
                Listings with real photos and detailed terms get booked up to 3×
                faster.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          These pages use mock data for now. Submitting the form logs the payload
          to the console.
        </div>
      </aside>
    </form>
  );
}
