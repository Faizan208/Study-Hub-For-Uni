"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Search } from "lucide-react";
import Image from "next/image";
import { quizzes, assignments, practicals, practicalFilters } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";

export default function Browse() {
  const [activeFilter, setActiveFilter] = React.useState("All");

  const filteredPracticals =
    activeFilter === "All"
      ? practicals
      : practicals.filter((p) => p.category === activeFilter);

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        {/* Latest Uploads */}
        <div className="mb-16">
          <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
            Latest Quizzes & Assignments
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...quizzes, ...assignments].map((item) => (
              <Card key={item.id} className="overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardContent className="p-0">
                  <Image
                    data-ai-hint={`${item.type} resource`}
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-primary">
                        {item.price} Rs
                      </p>
                      <Button>Buy Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Lab Practicals */}
        <div>
          <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
            Lab Practicals
          </h2>
          <div className="mb-8 flex flex-col items-center justify-center gap-4 md:flex-row">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search practicals..." className="w-full rounded-full bg-background/80 pl-10" />
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPracticals.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardContent className="p-0">
                   <Image
                    data-ai-hint={`${item.category} practical`}
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-primary">
                        {item.price} Rs
                      </p>
                      <Button>Buy Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
