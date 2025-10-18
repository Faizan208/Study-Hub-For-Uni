
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useFirebase } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";

export default function SignUpPage() {
  const auth = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSigningUp, setIsSigningUp] = React.useState(false);

  React.useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const handleSignUp = async () => {
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Authentication service is not available. Please try again later.",
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
    setIsSigningUp(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      if (firestore) {
        // Create a user profile document in Firestore
        await setDoc(doc(firestore, "users", newUser.uid), {
          email: newUser.email,
        });
      }
      
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-up Failed",
        description: error.message || "Could not create an account. Please try again.",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  if(isUserLoading || user) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Join LGU Study Hub to get started.</CardDescription>
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
            <Button onClick={handleSignUp} disabled={isSigningUp} className="w-full">
              {isSigningUp ? "Creating Account..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
