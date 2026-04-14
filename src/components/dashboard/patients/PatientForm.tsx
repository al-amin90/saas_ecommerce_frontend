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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IPatient } from "@/modules/patient/patient.interface";
import { useGetDynamicQuery } from "@/redux/features/dynamic/dynamicApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { IDoctor } from "@/modules/doctor/doctor.interface";

const schema = z.object({
  name: z.string().min(2),
  age: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  condition: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  doctorId: z.string().min(1),
});

type TForm = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  defaultValues?: Partial<IPatient>;
  isLoading?: boolean;
  mode?: "create" | "edit";
  defaultDoctorId?: string;
  hideDoctorField?: boolean;
};

export default function PatientForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
  defaultDoctorId,
  hideDoctorField = false,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TForm>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          age: defaultValues.age ? String(defaultValues.age) : "",
        }
      : undefined,
  });

  const { data: doctorsData } = useGetDynamicQuery(
    {
      url: "/doctors",
      params: {
        limit: 100,
      },
    },
    { skip: hideDoctorField },
  );

  const doctors = doctorsData?.data ?? [];

  useEffect(() => {
    if (open) {
      const doctorId = hideDoctorField
        ? defaultDoctorId
        : ((defaultValues?.doctorId?._id as string | undefined) ?? "");

      reset({
        name: defaultValues?.name || "",
        age: defaultValues?.age ? String(defaultValues.age) : "",
        gender: defaultValues?.gender || "male",
        condition: defaultValues?.condition || "",
        phone: defaultValues?.phone || "",
        email: defaultValues?.email || "",
        doctorId: doctorId || "",
      });
    }
  }, [open, defaultValues, defaultDoctorId, reset, hideDoctorField]);

  //   here is from filed infos
  const textFields: {
    name: keyof TForm;
    label: string;
    type?: string;
    placeholder: string;
  }[] = [
    { name: "name", label: "Full Name", placeholder: "Jane Doe" },
    { name: "age", label: "Age", type: "number", placeholder: "30" },
    { name: "condition", label: "Condition", placeholder: "Hypertension" },
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
      placeholder: "patient@email.com",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-white">
            {mode === "create" ? "Add New Patient" : "Edit Patient"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((d) =>
            onSubmit({ ...d, age: Number(d.age) } as Record<string, unknown>),
          )}
          className="space-y-3 py-2"
        >
          {textFields.map((f) => (
            <div key={f.name} className="space-y-1">
              <Label className="text-slate-700 dark:text-slate-300 text-sm">
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

          <div className="flex gap-7">
            {/* Gender */}
            <div className="space-y-1">
              <Label className="text-slate-700 dark:text-slate-300 text-sm">
                Gender
              </Label>
              <Select
                value={watch("gender")}
                onValueChange={(v) =>
                  setValue("gender", v as "male" | "female" | "other")
                }
              >
                <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900">
                  {["male", "female", "other"].map((g) => (
                    <SelectItem key={g} value={g} className="capitalize">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>

            {/* Doctor */}
            {!hideDoctorField && (
              <div className="space-y-1">
                <Label className="text-slate-700 dark:text-slate-300 text-sm">
                  Assigned Doctor
                </Label>
                <Select
                  value={watch("doctorId")}
                  onValueChange={(v) => setValue("doctorId", v)}
                >
                  <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900">
                    {(doctors as IDoctor[]).map((d) => (
                      <SelectItem key={d._id} value={d._id!}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctorId && (
                  <p className="text-xs text-red-500">
                    {errors.doctorId.message}
                  </p>
                )}
              </div>
            )}
          </div>

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
                  ? "Add Patient"
                  : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
