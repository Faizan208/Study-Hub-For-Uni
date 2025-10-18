import Header from "@/components/header";
import Hero from "@/components/hero";
import Browse from "@/components/browse";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Browse />
      </main>
    </div>
  );
}
