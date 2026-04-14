"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type Props = {
  page: number;
  totalPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, totalPage, onPageChange }: Props) {
  const pages = Array.from({ length: Math.min(totalPage, 5) }, (_, i) => {
    if (totalPage <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPage - 2) return totalPage - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Page{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {page}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {totalPage}
        </span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-8 w-8 rounded-lg text-sm",
              p === page &&
                "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white",
            )}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
