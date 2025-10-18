"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Search } from "lucide-react";
import Image from "next/image";
import { getAssignments, getPracticals, practicalFilters } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";

export default function Browse({ semester }: { semester: string }) {
  const [activeFilter, setActiveFilter] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const { user } = useUser();
  const router = useRouter();

  const assignments = getAssignments(semester);
  const allPracticals = getPracticals(semester);

  const filteredPracticals = allPracticals
    .filter((p) => activeFilter === "All" || p.category === activeFilter)
    .filter((p) => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const latestUploads = [...assignments];

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login");
    } else {
      // Implement buy now logic here
      console.log("Proceeding to purchase");
    }
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        {/* Assignments */}
        <div className="mb-16">
          <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
            Assignments for Semester {semester}
          </h2>
          {latestUploads.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {latestUploads.map((item) => (
                <Card key={item.id} className="overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col">
                  <CardContent className="p-0 flex flex-col flex-grow">
                    <div className="relative w-full h-48">
                      <Image
                        data-ai-hint={`${item.type} resource`}
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
                        <Button onClick={handleBuyNow}>Buy Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <p className="text-center text-muted-foreground">No assignments found for this semester.</p>
          )}
        </div>

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
          {filteredPracticals.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPracticals.map((item) => (
                <Card key={item.id} className="overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col">
                  <CardContent className="p-0 flex flex-col flex-grow">
                    <div className="relative w-full h-48">
                      <Image
                        data-ai-hint={`${item.category} practical`}
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
                        <Button onClick={handleBuyNow}>Buy Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No practicals found for this filter.</p>
          )}
        </div>
      </div>
    </section>
  );
}
