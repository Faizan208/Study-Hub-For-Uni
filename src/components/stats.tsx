"use client";

import { useRef, useEffect, useState } from "react";

const StatItem = ({
  value,
  label,
  inView,
  index,
}: {
  value: string;
  label: string;
  inView: boolean;
  index: number;
}) => (
  <div
    className="text-center transition-all duration-700 ease-out"
    style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transitionDelay: `${index * 150}ms`,
    }}
  >
    <h2 className="text-5xl font-bold text-primary lg:text-6xl">{value}</h2>
    <p className="mt-2 text-lg text-muted-foreground">{label}</p>
  </div>
);

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [resourceCount, setResourceCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const stats = [
    { value: resourceCount.toString(), label: "Resources" },
    { value: studentCount.toString(), label: "Students" },
  ];

  return (
    <section ref={ref} className="py-16 sm:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} {...stat} inView={inView} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
