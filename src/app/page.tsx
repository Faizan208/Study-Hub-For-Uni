"use client";

import * as React from "react";
import Header from "@/components/header";
import Hero from "@/app/hero";
import Browse from "@/components/browse";
import SemesterDialog from "@/components/semester-dialog";
import { useUser, useFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import Stats from "@/components/stats";
import About from "@/components/about";

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
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists() && userDoc.data().semester) {
              setSemester(userDoc.data().semester);
            } else {
              // No semester in profile, check local storage or open dialog
              const savedSemester = localStorage.getItem(`userSemester_${user.uid}`);
              if (savedSemester) {
                setSemester(savedSemester);
                // Optionally, save it to their Firestore profile
                setDocumentNonBlocking(userDocRef, { semester: savedSemester }, { merge: true });
              } else {
                setIsDialogOpen(true);
              }
            }
        } catch (e) {
            // This might be a permission error if rules are not set up
            // for reads. For now, we'll assume it might fail and open
            // the dialog as a fallback.
            console.error("Could not fetch user profile", e);
            setIsDialogOpen(true);
        }
      } else {
        // User is not logged in, do not show dialog or content
        setSemester(null);
        setIsDialogOpen(false);
      }
    };

    checkSemester();
  }, [user, isUserLoading, firestore]);

  const handleSemesterSave = async (selectedSemester: string) => {
     if (user && firestore) {
      // Logged-in user
      const userDocRef = doc(firestore, "users", user.uid);
      setDocumentNonBlocking(userDocRef, { semester: selectedSemester }, { merge: true });
      localStorage.setItem(`userSemester_${user.uid}`, selectedSemester);
    }
    // No longer saving for guest users
    setSemester(selectedSemester);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        {user && <SemesterDialog open={isDialogOpen} onSave={handleSemesterSave} />}
        <Hero />
        {user && semester && <Browse semester={semester} />}
        <Stats />
        <About />
      </main>
    </>
  );
}
