
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Search } from "lucide-react";
import Image from "next/image";
import { practicalFilters } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { useUser, useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import PaymentDialog from "./payment-dialog";
import { useToast } from "@/hooks/use-toast";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type PurchasableItem = {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    type?: string;
    category?: string;
    semester: string;
};

const AnimatedCard = ({ children, index }: { children: React.ReactNode, index: number }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {children}
    </div>
  );
};

const ResourceCard = ({ item, onBuyNow, index }: { item: PurchasableItem, onBuyNow: (item: PurchasableItem) => void, index: number }) => (
    <AnimatedCard index={index}>
        <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col h-full">
            <CardContent className="p-0 flex flex-col flex-grow">
                <div className="relative w-full h-48">
                <Image
                    data-ai-hint={`${item.type || item.category} resource`}
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground flex-grow">{item.description}</p>
                <div className="flex items-center justify-between mt-auto">
                    <p className="text-lg font-semibold text-primary">
                    {item.price} Rs
                    </p>
                    <Button onClick={() => onBuyNow(item)}>Buy Now</Button>
                </div>
                </div>
            </CardContent>
        </Card>
    </AnimatedCard>
);

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-10 w-1/3" />
                </div>
            </div>
        ))}
    </div>
);


export default function Browse({ semester }: { semester: string }) {
  const { firestore } = useFirebase();
  const [activeFilter, setActiveFilter] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<PurchasableItem | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);

  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const assignmentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "assignments"), where("semester", "==", semester));
  }, [firestore, semester]);

  const practicalsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "practicals"), where("semester", "==", semester));
  }, [firestore, semester]);

  const { data: assignments, isLoading: isLoadingAssignments } = useCollection<PurchasableItem>(assignmentsQuery);
  const { data: practicals, isLoading: isLoadingPracticals } = useCollection<PurchasableItem>(practicalsQuery);

  const filteredPracticals = (practicals || [])
    .filter((p) => activeFilter === "All" || p.category === activeFilter)
    .filter((p) => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  const handleBuyNow = (item: PurchasableItem) => {
    if (!user) {
      router.push("/login");
    } else {
      setSelectedItem(item);
      setIsPaymentDialogOpen(true);
    }
  };

  const handlePaymentConfirm = () => {
    toast({
        title: "Purchase Confirmed!",
        description: `Your request for "${selectedItem?.title}" has been received. You'll get access once payment is verified.`,
    });
    setIsPaymentDialogOpen(false);
    setSelectedItem(null);
  }

  const renderResourceSection = (title: string, data: PurchasableItem[] | null, isLoading: boolean) => (
     <div className="mb-16">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
            {title} for Semester {semester}
        </h2>
        {isLoading ? (
            <LoadingSkeleton />
        ) : data && data.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((item, index) => (
                <ResourceCard key={item.id} item={item} onBuyNow={handleBuyNow} index={index} />
            ))}
            </div>
        ) : (
            <p className="text-center text-muted-foreground">No {title.toLowerCase()} found for this semester.</p>
        )}
    </div>
  )

  return (
    <section id="browse" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        
        {renderResourceSection("Assignments", assignments, isLoadingAssignments)}
        
        {/* Lab Practicals */}
        <div>
          <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
            Lab Practicals for Semester {semester}
          </h2>
          <div className="mb-8 flex flex-col items-center justify-center gap-4 md:flex-row">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search practicals..." 
                  className="w-full rounded-full bg-background/80 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              {practicalFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
          {isLoadingPracticals ? <LoadingSkeleton /> : filteredPracticals.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPracticals.map((item, index) => (
                 <ResourceCard key={item.id} item={item} onBuyNow={handleBuyNow} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No practicals found for this filter.</p>
          )}
        </div>

        {selectedItem && (
            <PaymentDialog 
                open={isPaymentDialogOpen}
                onOpenChange={setIsPaymentDialogOpen}
                item={selectedItem}
                onConfirm={handlePaymentConfirm}
            />
        )}
      </div>
    </section>
  );
}
