"use client";

import { Mail, User, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <section className="py-20 md:py-28 bg-muted/50 dark:bg-muted/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-background p-8 text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                </div>
              <CardTitle className="text-3xl font-bold">Faizan Mukhtar</CardTitle>
              <p className="text-muted-foreground text-lg">BSCS Student</p>
            </CardHeader>
            <CardContent className="p-8">
              <p className="mb-6 text-center text-lg text-foreground/80">
                I'm a passionate Computer Science student dedicated to creating helpful resources for my peers. This platform is built to make our academic journey a little bit easier.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild variant="outline">
                  <a href="mailto:badalsenpai@gmail.com">
                    <Mail className="mr-2 h-4 w-4" /> Email Me
                  </a>
                </Button>
                <Button asChild>
                  <a href="https://www.instagram.com/corpy_boy?igsh=Z2pvcGJhNXU2YWl3" target="_blank" rel="noopener noreferrer">
                    <Instagram className="mr-2 h-4 w-4" /> Instagram
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
