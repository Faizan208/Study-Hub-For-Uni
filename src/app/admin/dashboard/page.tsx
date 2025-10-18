
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useFirebase, useUser } from "@/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookCopy, FlaskConical } from "lucide-react";
import Link from "next/link";

const StatCard = ({ title, value, icon: Icon, href } : {title: string, value: number, icon: React.ElementType, href: string}) => (
    <Link href={href}>
        <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    </Link>
)


export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();

  const [checkingAdmins, setCheckingAdmins] = React.useState(true);
  const [counts, setCounts] = React.useState({ assignments: 0, quizzes: 0, practicals: 0});
  const [isLoadingCounts, setIsLoadingCounts] = React.useState(true);


  React.useEffect(() => {
    if (isUserLoading || !firestore) return;

    if (!user) {
      // Not logged in, check if any admin exists to decide where to redirect.
      const checkAdmins = async () => {
        const adminsQuery = query(collection(firestore, "admins"), limit(1));
        try {
          const adminSnapshot = await getDocs(adminsQuery);
          if (adminSnapshot.empty) {
            router.push("/admin/setup");
          } else {
            router.push("/admin/login");
          }
        } catch (e) {
          router.push("/admin/setup");
        } finally {
            setCheckingAdmins(false);
        }
      };
      checkAdmins();
    } else {
      setCheckingAdmins(false);
      // Fetch counts for dashboard
      const fetchCounts = async () => {
        setIsLoadingCounts(true);
        try {
            const [assignmentsSnap, quizzesSnap, practicalsSnap] = await Promise.all([
                getDocs(collection(firestore, "assignments")),
                getDocs(collection(firestore, "quizzes")),
                getDocs(collection(firestore, "practicals")),
            ]);
            setCounts({
                assignments: assignmentsSnap.size,
                quizzes: quizzesSnap.size,
                practicals: practicalsSnap.size,
            })
        } catch (error) {
            console.error("Error fetching resource counts:", error);
        }
        setIsLoadingCounts(false);
      }
      fetchCounts();
    }
  }, [user, isUserLoading, firestore, router]);


  if (isUserLoading || checkingAdmins || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
                Overview of your academic resources.
            </p>
        </div>
        {isLoadingCounts ? (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">-</div></CardContent></Card>
                <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">-</div></CardContent></Card>
                <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">-</div></CardContent></Card>
             </div>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Assignments" value={counts.assignments} icon={FileText} href="/admin/dashboard/assignments" />
                <StatCard title="Total Quizzes" value={counts.quizzes} icon={BookCopy} href="/admin/dashboard/quizzes" />
                <StatCard title="Total Practicals" value={counts.practicals} icon={FlaskConical} href="/admin/dashboard/practicals" />
            </div>
        )}
    </div>
  );
}
