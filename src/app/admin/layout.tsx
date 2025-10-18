
"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookCopy,
  FileText,
  FlaskConical,
  Home,
  LogOut,
  PanelLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";
import { useAuth } from "@/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  {
    href: "/admin/dashboard",
    icon: Home,
    label: "Dashboard",
  },
  {
    href: "/admin/dashboard/assignments",
    icon: FileText,
    label: "Assignments",
  },
  {
    href: "/admin/dashboard/quizzes",
    icon: BookCopy,
    label: "Quizzes",
  },
  {
    href: "/admin/dashboard/practicals",
    icon: FlaskConical,
    label: "Practicals",
  },
];

const NavItem = ({
  item,
}: {
  item: { href: string; icon: React.ElementType; label: string };
}) => {
  const { isMobile, state } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <SidebarMenuItem>
      <Link href={item.href}>
        <SidebarMenuButton
          isActive={isActive}
          icon={item.icon}
          tooltip={{
            children: item.label,
            hidden: isMobile || state === "expanded",
          }}
        >
          {item.label}
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
};

const UserMenu = () => {
  const auth = useAuth();
  const router = useRouter();
  const { user } = useUser();

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      router.push("/admin/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="#" alt="Admin" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isUserLoading && !user && pathname !== "/admin/login" && pathname !== "/admin/setup") {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, router, pathname]);

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  
  if (!user && (pathname.startsWith('/admin/dashboard'))) {
     return null; // Don't render layout if not logged in and trying to access dashboard
  }

  if (pathname === "/admin/login" || pathname === "/admin/setup") {
    return (
       <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
        {children}
       </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="p-4 justify-between flex flex-row items-center">
             <h2 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">LGU Study Hub</h2>
             <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
             <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="w-full flex-1">
              {/* Optional: Add search or other header items here */}
            </div>
            <UserMenu />
          </header>
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
