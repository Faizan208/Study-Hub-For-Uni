import Header from "@/components/header";
import Hero from "@/components/hero";
import Stats from "@/components/stats";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
      </main>
    </div>
  );
}
