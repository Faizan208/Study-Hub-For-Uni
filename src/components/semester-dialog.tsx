"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

interface SemesterDialogProps {
  open: boolean;
  onSave: (semester: string) => void;
}

export default function SemesterDialog({ open, onSave }: SemesterDialogProps) {
  const [selectedSemester, setSelectedSemester] = React.useState("");

  const handleSave = () => {
    if (selectedSemester) {
      onSave(selectedSemester);
    }
  };

  const semesters = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to LGU Study Hub</DialogTitle>
          <DialogDescription>
            Please select your current semester to see relevant course materials.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="semester" className="text-right">
              Semester
            </Label>
            <Select onValueChange={setSelectedSemester} value={selectedSemester}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select your semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!selectedSemester}>
            Show My Courses
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
