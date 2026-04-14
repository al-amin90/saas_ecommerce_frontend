"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IDoctor } from "@/modules/doctor/doctor.interface";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  specialization: z.string().min(2, "Specialization required"),
  hospital: z.string().min(2, "Hospital required"),
  phone: z.string().min(7, "Valid phone required"),
  email: z.string().email("Valid email required"),
});

type TForm = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: TForm) => Promise<void>;
  defaultValues?: Partial<IDoctor>;
  isLoading?: boolean;
  mode?: "create" | "edit";
};

export default function DoctorForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) reset(defaultValues ?? {});
  }, [open, defaultValues, reset]);

  const fields: {
    name: keyof TForm;
    label: string;
    type?: string;
    placeholder: string;
  }[] = [
    { name: "name", label: "Full Name", placeholder: "Dr. John Smith" },
    {
      name: "specialization",
      label: "Specialization",
      placeholder: "Cardiology",
    },
    { name: "hospital", label: "Hospital", placeholder: "City Medical Center" },
    {
      name: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "+880 1700 000000",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "doctor@hospital.com",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-white text-lg">
            {mode === "create" ? "Add New Doctor" : "Edit Doctor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {f.label}
              </Label>
              <Input
                {...register(f.name)}
                type={f.type ?? "text"}
                placeholder={f.placeholder}
                className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
              />
              {errors[f.name] && (
                <p className="text-xs text-red-500">
                  {errors[f.name]?.message}
                </p>
              )}
            </div>
          ))}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-200 dark:border-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading
                ? mode === "create"
                  ? "Adding..."
                  : "Saving..."
                : mode === "create"
                  ? "Add Doctor"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
