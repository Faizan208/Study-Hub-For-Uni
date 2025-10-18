"use client";

import * as React from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Browse from "@/components/browse";
import SemesterDialog from "@/components/semester-dialog";

export default function Home() {
  const [semester, setSemester] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const savedSemester = localStorage.getItem("userSemester");
    if (savedSemester) {
      setSemester(savedSemester);
    } else {
      setIsDialogOpen(true);
    }
  }, []);

  const handleSemesterSave = (selectedSemester: string) => {
    localStorage.setItem("userSemester", selectedSemester);
    setSemester(selectedSemester);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <SemesterDialog open={isDialogOpen} onSave={handleSemesterSave} />
        <Hero />
        {semester && <Browse semester={semester} />}
      </main>
    </div>
  );
}
