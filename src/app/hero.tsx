import { ArrowRight, Book, BookOpenCheck, GraduationCap, Lightbulb, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FloatingIcon = ({ icon: Icon, className, animationClass } : {icon: React.ElementType, className: string, animationClass: string}) => (
  <div className={`absolute ${className} hidden md:block`}>
    <div className={`relative ${animationClass}`}>
      <div className="absolute inset-0 -m-4 bg-primary/10 rounded-full blur-xl"></div>
      <Icon className="relative h-12 w-12 text-primary/80" />
    </div>
  </div>
);

const FloatingBadge = ({ text, icon: Icon, className, animationClass } : {text: string, icon: React.ElementType, className: string, animationClass: string}) => (
    <div className={`absolute ${className} hidden md:block ${animationClass}`}>
        <div className="relative">
            <div className="flex items-center gap-2 rounded-full bg-background/80 p-3 px-4 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary"/>
                </div>
                <span className="font-semibold text-foreground/80">{text}</span>
            </div>
        </div>
    </div>
);

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block text-primary">Learn Smart,</span>
            <span className="block text-accent">Work Fast</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
            Your central hub for academic resources at LGU. Access past papers,
            assignments, and study materials to excel in your studies.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto transition-transform duration-300 hover:scale-105"
            >
              <Link href="#">
                Explore Resources <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-2 sm:w-auto transition-transform duration-300 hover:scale-105"
            >
              <Link href="#">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <FloatingIcon icon={Book} className="top-[15%] left-[10%]" animationClass="animate-float" />
      <FloatingIcon icon={Lightbulb} className="bottom-[10%] left-[20%]" animationClass="animate-float-slow" />
      <FloatingIcon icon={GraduationCap} className="top-[20%] right-[12%]" animationClass="animate-float" />
      
      <FloatingBadge text="Assignments" icon={PenSquare} className="bottom-[15%] right-[15%]" animationClass="animate-float-slow" />
      <FloatingBadge text="Past Papers" icon={BookOpenCheck} className="top-[50%] left-[5%]" animationClass="animate-float" />

    </section>
  );
}
