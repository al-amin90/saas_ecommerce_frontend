"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { Plus, Trash2, Users } from "lucide-react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PatientForm from "@/components/patients/PatientForm";
import { toast } from "sonner";
import Pagination from "@/components/shared/Pagination";
import SearchInput from "@/components/shared/SearchInput";
import { IDoctor } from "@/modules/doctor/doctor.interface";
import { IPatient } from "@/modules/patient/patient.interface";
import {
  useDeleteDynamicMutation,
  useGetDynamicQuery,
  usePostDynamicMutation,
} from "@/redux/features/dynamic/dynamicApi";

type Props = {
  doctor: IDoctor | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function PatientListModal({
  doctor,
  open,
  onOpenChange,
}: Props) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const { data, isLoading, refetch } = useGetDynamicQuery(
    {
      url: `/doctors/${doctor?._id}/patients`,
      params: {
        page,
        limit: 5,
        searchTerm,
      },
    },
    {
      skip: !doctor?._id,
    },
  );

  const [deletePatient, { isLoading: deleting }] = useDeleteDynamicMutation();
  const [createPatient, { isLoading: creating }] = usePostDynamicMutation();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePatient({
        url: `patients/${deleteId}`,
      }).unwrap();
      refetch();

      toast.success("Patient removed");
      setDeleteId(null);
    } catch {
      toast.error("Failed to remove patient");
    }
  };

  const handleAdd = async (formData: Record<string, unknown>) => {
    const formmateData = { ...formData, doctorId: doctor?._id };

    try {
      await createPatient({ url: "patients", data: formmateData }).unwrap();
      refetch();

      toast.success("Patient added");
      setAddOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add patient");
    }
  };

  const patients = data?.data ?? [];
  const meta = data?.meta;

  const genderColor = (g: string) =>
    g === "male"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
      : g === "female"
        ? "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300"
        : "bg-slate-100 text-slate-600";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-slate-800 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              {doctor?.name} — Patients
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between gap-3 shrink-0">
            <SearchInput
              value={searchTerm}
              onChange={(v) => {
                setSearchTerm(v);
                setPage(1);
              }}
              placeholder="Search patients..."
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={() => setAddOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Patient
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))
            ) : patients.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No patients found</p>
              </div>
            ) : (
              (patients as IPatient[]).map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {p.condition} · Age {p.age}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${genderColor(p.gender)}`}
                  >
                    {p.gender}
                  </span>
                  <button
                    onClick={() => setDeleteId(p._id)}
                    className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {meta && meta.totalPage >= 1 && (
            <div className="shrink-0 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Pagination
                page={page}
                totalPage={meta.totalPage}
                onPageChange={setPage}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Remove Patient?"
        description="This will soft-delete the patient from this doctor's list."
        onConfirm={handleDelete}
        loading={deleting}
      />

      <PatientForm
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        isLoading={creating}
        mode="create"
        defaultDoctorId={doctor?._id}
        hideDoctorField
      />
    </>
  );
}
