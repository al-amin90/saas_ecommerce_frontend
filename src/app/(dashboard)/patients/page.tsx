"use client";

import { useEffect, useState } from "react";

import DataTable from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import SearchInput from "@/components/shared/SearchInput";
import DateRangePicker from "@/components/shared/DateRangePicker";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PatientForm from "@/components/patients/PatientForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { IPatient } from "@/modules/patient/patient.interface";
import {
  useDeleteDynamicMutation,
  useGetDynamicQuery,
  usePatchDynamicMutation,
  usePostDynamicMutation,
} from "@/redux/features/dynamic/dynamicApi";
import PageHeadingTitle from "@/components/shared/PageHeadingTitle";
import FilterBar from "@/components/shared/FilterBar";

const CONDITIONS = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Arthritis",
  "Cancer",
  "Heart Disease",
  "Depression",
  "Anxiety",
];

const genderBadge = (g: string) => {
  if (g === "male")
    return "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";
  if (g === "female")
    return "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300";
  return "bg-slate-100 text-slate-600";
};

export default function PatientsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [gender, setGender] = useState("");
  const [condition, setCondition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<IPatient | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetDynamicQuery({
    url: "/patients",
    params: {
      page,
      limit: 5,
      searchTerm,
      gender: gender || undefined,
      condition: condition || undefined,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });

  const [createPatient, { isLoading: creating }] = usePostDynamicMutation();
  const [updatePatient, { isLoading: updating }] = usePatchDynamicMutation();
  const [deletePatient, { isLoading: deleting }] = useDeleteDynamicMutation();

  const patients = data?.data ?? [];
  const meta = data?.meta;

  const handleCreate = async (form: Record<string, unknown>) => {
    try {
      await createPatient({ url: "patients", data: form }).unwrap();
      toast.success("Patient added successfully");
      setCreateOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add patient");
    }
  };

  const handleUpdate = async (form: Record<string, unknown>) => {
    if (!editPatient) return;
    try {
      await updatePatient({
        url: `patients/${editPatient._id}`,
        data: form as Partial<IPatient>,
      }).unwrap();
      toast.success("Patient updated");
      setEditPatient(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePatient({
        url: `patients/${deleteId}`,
      }).unwrap();
      toast.success("Patient deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Patient",
      render: (row: IPatient) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {row.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-white text-sm">
              {row.name}
            </p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "age",
      label: "Age",
      render: (row: IPatient) => (
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {row.age} yrs
        </span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (row: IPatient) => (
        <Badge
          variant="secondary"
          className={`border-0 font-medium text-xs capitalize ${genderBadge(row.gender)}`}
        >
          {row.gender}
        </Badge>
      ),
    },
    {
      key: "condition",
      label: "Condition",
      render: (row: IPatient) => (
        <Badge
          variant="secondary"
          className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-0 text-xs font-medium"
        >
          {row.condition}
        </Badge>
      ),
    },
    {
      key: "doctor",
      label: "Doctor",
      render: (row: IPatient) => (
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {row.doctorId?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Registered",
      render: (row: IPatient) => (
        <span className="text-xs text-slate-400">
          {row.createdAt ? format(parseISO(row.createdAt), "MMM d, yyyy") : ""}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row: IPatient) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setEditPatient(row);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(row._id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeadingTitle name={"Patients"} meta={meta} />

        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setPage={setPage}
        value={condition}
        setValue={setCondition}
        valueOptions={CONDITIONS}
        valueLabel={"Conditions"}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        gender={gender}
        setGender={setGender}
        isGenderSelect={true}
      />

      <DataTable
        data={patients}
        columns={columns}
        isLoading={isLoading}
        rowKey={(r) => r._id}
        emptyMessage="No patients found."
      />

      {/* pagination ys here*/}
      {meta && meta.totalPage >= 1 && (
        <Pagination
          page={page}
          totalPage={meta.totalPage}
          onPageChange={setPage}
        />
      )}

      {/*all modals are here */}
      <PatientForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isLoading={creating}
        mode="create"
      />
      <PatientForm
        open={!!editPatient}
        onOpenChange={(v) => !v && setEditPatient(null)}
        onSubmit={handleUpdate}
        defaultValues={editPatient ?? undefined}
        isLoading={updating}
        mode="edit"
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Patient?"
        description="This will soft-delete the patient record."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
