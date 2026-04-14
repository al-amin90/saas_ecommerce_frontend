"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/utils";
import { format } from "date-fns";

type Props = {
  startDate?: string;
  endDate?: string;
  onChange: (start: string, end: string) => void;
};

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined,
  );
  const [end, setEnd] = useState<Date | undefined>(
    endDate ? new Date(endDate) : undefined,
  );

  const apply = () => {
    onChange(
      start ? format(start, "yyyy-MM-dd") : "",
      end ? format(end, "yyyy-MM-dd") : "",
    );
    setOpen(false);
  };

  const clear = () => {
    setStart(undefined);
    setEnd(undefined);
    onChange("", "");
    setOpen(false);
  };

  const label =
    start && end
      ? `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`
      : start
        ? `From ${format(start, "MMM d, yyyy")}`
        : "Date range";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 gap-2 text-sm border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800",
            (start || end) &&
              "text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700",
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          {label}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-4 space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        align="start"
      >
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-medium">
              Start date
            </p>
            <Calendar
              mode="single"
              selected={start}
              onSelect={setStart}
              className="rounded-md border border-slate-100 dark:border-slate-800"
            />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1 font-medium">End date</p>
            <Calendar
              mode="single"
              selected={end}
              onSelect={setEnd}
              disabled={(d) => !!start && d < start}
              className="rounded-md border border-slate-100 dark:border-slate-800"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-slate-500"
          >
            Clear
          </Button>
          <Button
            size="sm"
            onClick={apply}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
