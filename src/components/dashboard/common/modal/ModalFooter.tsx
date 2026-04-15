import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import React from "react";

const ModalFooter = ({
  isLoading,
  mode,
  name = "Patient",
  onCancel,
}: {
  isLoading?: boolean;
  mode?: "create" | "edit";
  name: string;
  onCancel: () => void;
}) => {
  return (
    <div>
      <DialogFooter className="pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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
              ? `Add ${name}`
              : "Save"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ModalFooter;
