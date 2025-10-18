
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, useFirebase, setDocumentNonBlocking } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, collection, getDocs, query, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";

export default function AdminSetupPage() {
  const auth = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isCreatingAccount, setIsCreatingAccount] = React.useState(false);
  const [checkingAdmins, setCheckingAdmins] = React.useState(true);


  React.useEffect(() => {
    if (isUserLoading || !firestore) return;

    // If a user is already logged in, send them to the dashboard
    if (user) {
      router.push("/admin/dashboard");
      return;
    }

    // Check if any admin accounts already exist. If so, redirect to login.
    const checkAdmins = async () => {
        const adminsQuery = query(collection(firestore, 'admins'), limit(1));
        const adminSnapshot = await getDocs(adminsQuery);
        if (!adminSnapshot.empty) {
            router.push('/admin/login');
        } else {
            setCheckingAdmins(false);
        }
    };
    checkAdmins();

  }, [user, isUserLoading, firestore, router]);


  const handleCreateAccount = async () => {
    if (!auth || !firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Services not available. Please try again later.",
        });
        return;
    }
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both email and password.",
      });
      return;
    }
    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Weak Password",
            description: "Password must be at least 6 characters long.",
        });
        return;
    }
    
    setIsCreatingAccount(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newAdmin = userCredential.user;

      const adminProfileData = {
        id: newAdmin.uid,
        email: newAdmin.email,
        name: "Administrator",
        role: 'superadmin',
      };
      
      // This creates the admin document in the 'admins' collection
      await setDocumentNonBlocking(doc(firestore, "admins", newAdmin.uid), adminProfileData, { merge: false });
      
      toast({
        title: "Admin Account Created",
        description: "Redirecting to your dashboard...",
      });
      
      router.push("/admin/dashboard");

    } catch (error: any) {
      let description = "Could not create account. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This email is already in use. Try logging in instead.";
      } else if (error.code === 'auth/invalid-email') {
        description = "Please enter a valid email address.";
      }
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description,
      });
    } finally {
      setIsCreatingAccount(false);
    }
  };

  if(isUserLoading || user || checkingAdmins) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Account Setup</CardTitle>
          <CardDescription>Create the first administrator account for LGU Study Hub.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Admin Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button onClick={handleCreateAccount} disabled={isCreatingAccount} className="w-full">
              {isCreatingAccount ? "Creating Account..." : "Create Admin Account"}
            </Button>
             <p className="text-xs text-center text-muted-foreground pt-2">
                This setup page is for creating the first admin only. Once an admin exists, this page will no longer be accessible.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
