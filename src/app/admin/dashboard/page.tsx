
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, useFirebase } from "@/firebase";
import {
  collection,
  serverTimestamp,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [checkingAdmins, setCheckingAdmins] = React.useState(true);

  React.useEffect(() => {
    if (isUserLoading || !firestore) return;

    if (!user) {
      // Not logged in, check if any admin exists to decide where to redirect.
      const checkAdmins = async () => {
        const adminsQuery = query(collection(firestore, "admins"), limit(1));
        const adminSnapshot = await getDocs(adminsQuery);
        if (adminSnapshot.empty) {
          router.push("/admin/setup");
        } else {
          router.push("/admin/login");
        }
      };
      checkAdmins();
    } else {
        // User is logged in, no need to check for other admins.
        setCheckingAdmins(false);
    }
  }, [user, isUserLoading, firestore, router]);

  const handleUpload = () => {
    if (!firestore || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Not authenticated.",
      });
      return;
    }
    if (!title || !description) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill out all fields.",
      });
      return;
    }

    setIsUploading(true);

    const assignmentData = {
      title,
      description,
      adminId: user.uid,
      uploadDate: serverTimestamp(),
    };

    try {
        const assignmentsCollection = collection(firestore, 'assignments');
        addDocumentNonBlocking(assignmentsCollection, assignmentData);

      toast({
        title: "Upload Successful",
        description: "The assignment has been uploaded.",
      });
      setTitle("");
      setDescription("");
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not upload the assignment. Please try again.",
      });
    } finally {
        setIsUploading(false);
    }
  };
  
  const handleSignOut = async () => {
    if (!auth) return;
    await auth.signOut();
    router.push('/');
  };

  if (isUserLoading || checkingAdmins || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
       <div className="absolute top-4 right-4">
        <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
      </div>
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Upload New Assignment</h2>
              <div className="space-y-2">
                <Input
                  placeholder="Assignment Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Assignment Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? "Uploading..." : "Upload Assignment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
