
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, useFirebase } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";

export default function AdminLogin() {
  const auth = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [checkingAdmins, setCheckingAdmins] = React.useState(true);

  React.useEffect(() => {
    if (isUserLoading || !firestore) return;

    if (user) {
      router.push("/admin/dashboard");
      return;
    }

    const checkAdmins = async () => {
      const adminsQuery = query(collection(firestore, "admins"), limit(1));
      const adminSnapshot = await getDocs(adminsQuery);
      if (adminSnapshot.empty) {
        router.push("/admin/setup");
      } else {
        setCheckingAdmins(false);
      }
    };
    checkAdmins();
  }, [user, isUserLoading, firestore, router]);


  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both email and password.",
      });
      return;
    }
    setIsSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (error: any) {
      let description = "An unknown error occurred. Please try again.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          description = "Invalid email or password. Please try again.";
      }
      toast({
        variant: "destructive",
        title: "Sign-in Failed",
        description: description,
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  if(isUserLoading || user || checkingAdmins) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button onClick={handleSignIn} disabled={isSigningIn} className="w-full">
              {isSigningIn ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
