
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, useFirebase } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from "@/firebase";

export default function AdminLogin() {
  const auth = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = React.useState("badalsenpai@gmail.com");
  const [password, setPassword] = React.useState("#Faizan7676!");
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [checkingAdmins, setCheckingAdmins] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isUserLoading || !firestore) return;

    if (user) {
      router.push("/admin/dashboard");
      return;
    }

    const checkAdmins = async () => {
      const adminsQuery = query(collection(firestore, "admins"), limit(1));
      try {
        const adminSnapshot = await getDocs(adminsQuery);
        if (adminSnapshot.empty) {
          router.push("/admin/setup");
        } else {
          setCheckingAdmins(false);
        }
      } catch (e) {
        // This might happen if rules deny list access to non-admins.
        // We'll proceed assuming an admin exists.
        setCheckingAdmins(false);
      }
    };
    checkAdmins();
  }, [user, isUserLoading, firestore, router]);


  const handleSignIn = async () => {
    if (!email || !password) {
       setError("Please enter both email and password.");
      return;
    }
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (error: any) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
             setError("Incorrect email or password. Please check your credentials and try again.");
        } else {
             setError("An unknown error occurred during sign-in. Please try again later.");
        }
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
             {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <Button onClick={handleSignIn} disabled={isSigningIn} className="w-full">
              {isSigningIn ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
