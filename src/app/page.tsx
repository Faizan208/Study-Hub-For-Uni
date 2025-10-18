"use client";

import * as React from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Browse from "@/components/browse";
import SemesterDialog from "@/components/semester-dialog";
import { useUser, useFirebase } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const [semester, setSemester] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const checkSemester = async () => {
      if (isUserLoading) return;

      if (user && firestore) {
        // User is logged in, check their profile for a semester
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().semester) {
          setSemester(userDoc.data().semester);
        } else {
          // No semester in profile, check local storage or open dialog
          const savedSemester = localStorage.getItem(`userSemester_${user.uid}`);
          if (savedSemester) {
            setSemester(savedSemester);
            // Optionally, save it to their Firestore profile
            await setDoc(userDocRef, { semester: savedSemester }, { merge: true });
          } else {
            setIsDialogOpen(true);
          }
        }
      } else {
        // User is not logged in, use local storage
        const savedSemester = localStorage.getItem("userSemester_guest");
        if (savedSemester) {
          setSemester(savedSemester);
        } else {
          setIsDialogOpen(true);
        }
      }
    };

    checkSemester();
  }, [user, isUserLoading, firestore]);

  const handleSemesterSave = async (selectedSemester: string) => {
     if (user && firestore) {
      // Logged-in user
      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, { semester: selectedSemester }, { merge: true });
      localStorage.setItem(`userSemester_${user.uid}`, selectedSemester);
    } else {
      // Guest user
      localStorage.setItem("userSemester_guest", selectedSemester);
    }
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
