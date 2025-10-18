"use client";

import Link from "next/link";
import { BookOpenCheck, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import * as React from "react";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";

const navLinks = [
  { href: "#", label: "Home" },
  { href: "#", label: "Browse" },
  { href: "#", label: "About" },
  { href: "#", label: "Contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();


  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    if (user) {
      auth.signOut();
      router.push('/');
    }
  };


  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b bg-background/80 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <BookOpenCheck className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">LGU Study Hub</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative font-medium text-foreground/80 transition-colors hover:text-foreground"
              prefetch={false}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 block h-0.5 w-full scale-x-0 transform bg-primary transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="grid gap-6 p-6">
                <Link
                  href="#"
                  className="flex items-center gap-2"
                  prefetch={false}
                >
                  <BookOpenCheck className="h-6 w-6 text-primary" />
                  <span className="font-bold">LGU Study Hub</span>
                </Link>
                <nav className="grid gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      prefetch={false}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
