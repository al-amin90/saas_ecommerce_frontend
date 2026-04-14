"use client";

import { useState } from "react";
import DataTable from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import SearchInput from "@/components/shared/SearchInput";
import DateRangePicker from "@/components/shared/DateRangePicker";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import DoctorForm from "@/components/doctors/DoctorForm";
import PatientListModal from "@/components/doctors/PatientListModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Stethoscope,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { IDoctor } from "@/modules/doctor/doctor.interface";
import {
  useDeleteDynamicMutation,
  useGetDynamicQuery,
  usePatchDynamicMutation,
  usePostDynamicMutation,
} from "@/redux/features/dynamic/dynamicApi";
import PageHeadingTitle from "@/components/shared/PageHeadingTitle";
import FilterBar from "@/components/shared/FilterBar";

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Oncology",
  "Psychiatry",
  "General Practice",
];

export default function DoctorsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editDoctor, setEditDoctor] = useState<IDoctor | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [patientDoctor, setPatientDoctor] = useState<IDoctor | null>(null);

  const { data, isLoading } = useGetDynamicQuery({
    url: "/doctors",
    params: {
      page,
      limit: 5,
      searchTerm,
      specialization: specialization || undefined,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });

  const [createDoctor, { isLoading: creating }] = usePostDynamicMutation();
  const [updateDoctor, { isLoading: updating }] = usePatchDynamicMutation();
  const [deleteDoctor, { isLoading: deleting }] = useDeleteDynamicMutation();

  const doctors = data?.data ?? [];
  const meta = data?.meta;

  const handleCreate = async (form: Partial<IDoctor>) => {
    try {
      await createDoctor({ url: "doctors", data: form }).unwrap();
      toast.success("Doctor added successfully");
      setCreateOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add doctor");
    }
  };

  const handleUpdate = async (form: Partial<IDoctor>) => {
    if (!editDoctor) return;
    try {
      await updateDoctor({
        url: `doctors/${editDoctor._id}`,
        data: form,
      }).unwrap();
      toast.success("Doctor updated");
      setEditDoctor(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoctor({
        url: `doctors/${deleteId}`,
      }).unwrap();
      toast.success("Doctor deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete doctor");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Doctor",
      render: (row: IDoctor) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
            <Stethoscope className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
      key: "specialization",
      label: "Specialization",
      render: (row: IDoctor) => (
        <Badge
          variant="secondary"
          className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-0 font-medium text-xs"
        >
          {row.specialization}
        </Badge>
      ),
    },
    {
      key: "hospital",
      label: "Hospital",
      render: (row: IDoctor) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm">
          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-[160px]">{row.hospital}</span>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row: IDoctor) => (
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {row.phone}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (row: IDoctor) => (
        <span className="text-xs text-slate-400">
          {format(parseISO(row.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row: IDoctor) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setPatientDoctor(row);
            }}
            title="View patients"
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setEditDoctor(row);
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
              setDeleteId(row._id || null);
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
        <PageHeadingTitle name={"Doctors"} meta={meta} />
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setPage={setPage}
        value={specialization}
        setValue={setSpecialization}
        valueOptions={SPECIALIZATIONS}
        valueLabel={"Specializations"}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <DataTable
        data={doctors}
        columns={columns}
        isLoading={isLoading}
        rowKey={(r) => r._id || ''}
        emptyMessage="No doctors found. Add your first doctor."
      />

      {/* Pagination */}
      {meta && meta.totalPage >= 1 && (
        <Pagination
          page={page}
          totalPage={meta.totalPage}
          onPageChange={setPage}
        />
      )}

      {/*all modals are here */}
      <DoctorForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isLoading={creating}
        mode="create"
      />
      <DoctorForm
        open={!!editDoctor}
        onOpenChange={(v) => !v && setEditDoctor(null)}
        onSubmit={handleUpdate}
        defaultValues={editDoctor ?? undefined}
        isLoading={updating}
        mode="edit"
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Doctor?"
        description="This will soft-delete the doctor. Their patient records remain intact."
        onConfirm={handleDelete}
        loading={deleting}
      />
      <PatientListModal
        doctor={patientDoctor}
        open={!!patientDoctor}
        onOpenChange={(v) => !v && setPatientDoctor(null)}
      />
    </div>
  );
}
