"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

type PatientFormData = {
  name: string;
  gender: string;
  age: number;
  condition: string;
  doctorId?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: PatientFormData) => Promise<void>;
  isLoading?: boolean;
  mode?: "create" | "edit";
  defaultDoctorId?: string;
  hideDoctorField?: boolean;
};

export default function PatientForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  mode = "create",
  defaultDoctorId,
  hideDoctorField,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>({
    defaultValues: {
      doctorId: defaultDoctorId,
      gender: "male",
      age: 0,
      condition: "",
      name: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        doctorId: defaultDoctorId,
        gender: "male",
        age: 0,
        condition: "",
        name: "",
      });
    }
  }, [open, defaultDoctorId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-white text-lg">
            {mode === "create" ? "Add Patient" : "Edit Patient"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              {...register("name", { required: true })}
              placeholder="Patient name"
            />
            {errors.name && (
              <p className="text-xs text-red-500">Name is required</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Gender</Label>
            <Input
              {...register("gender", { required: true })}
              placeholder="male / female"
            />
            {errors.gender && (
              <p className="text-xs text-red-500">Gender is required</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Age</Label>
            <Input
              type="number"
              {...register("age", { valueAsNumber: true })}
              placeholder="Age"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Condition</Label>
            <Input
              {...register("condition", { required: true })}
              placeholder="Patient condition"
            />
            {errors.condition && (
              <p className="text-xs text-red-500">Condition is required</p>
            )}
          </div>

          {!hideDoctorField && (
            <div className="space-y-1.5">
              <Label>Doctor ID</Label>
              <Input {...register("doctorId")} placeholder="Doctor ID" />
            </div>
          )}

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
                ? "Saving..."
                : mode === "create"
                  ? "Add Patient"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
