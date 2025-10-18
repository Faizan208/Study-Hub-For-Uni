"use client";

import { BookOpenCheck, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const SocialLink = ({ href, icon: Icon, label }: { href: string, icon: React.ElementType, label: string }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
        <Icon className="h-6 w-6" />
        <span className="sr-only">{label}</span>
    </Link>
);

export default function Footer() {
    return (
        <footer className="bg-background/80 backdrop-blur-sm border-t mt-auto">
            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <BookOpenCheck className="h-6 w-6 text-primary" />
                        <span className="text-lg font-bold text-primary">LGU Study Hub</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} LGU Study Hub. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <SocialLink href="#" icon={Twitter} label="Twitter" />
                        <SocialLink href="https://www.instagram.com/corpy_boy?igsh=Z2pvcGJhNXU2YWl3" icon={Instagram} label="Instagram" />
                        <SocialLink href="#" icon={Facebook} label="Facebook" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
