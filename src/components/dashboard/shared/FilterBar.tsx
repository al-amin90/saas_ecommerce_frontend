import React from "react";
import { Button } from "../ui/button";
import DateRangePicker from "./DateRangePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import SearchInput from "./SearchInput";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
  value: string;
  setValue: (value: string) => void;
  valueOptions: string[];
  valueLabel: string;
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  gender?: string;
  setGender?: (gender: string) => void;
  isGenderSelect?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  setPage,
  value,
  setValue,
  valueOptions,
  valueLabel,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  gender,
  setGender,
  isGenderSelect = false,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={searchTerm}
          onChange={(v) => {
            setSearchTerm(v);
            setPage(1);
          }}
          placeholder="Search by name, hospital..."
          className="w-64"
        />

        {isGenderSelect && (
          <Select
            value={gender}
            onValueChange={(v) => {
              setGender?.(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-32 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900">
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select
          value={value}
          onValueChange={(v) => {
            setValue(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm">
            <SelectValue placeholder={valueLabel} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900">
            <SelectItem value="all">All {valueLabel}</SelectItem>
            {valueOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(s, e) => {
            setStartDate(s);
            setEndDate(e);
            setPage(1);
          }}
        />

        {(searchTerm || value || startDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setValue("");
              setStartDate("");
              setEndDate("");
              setPage(1);
            }}
            className="text-slate-400 hover:text-slate-600 text-xs"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
