import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "LGU Study Hub - Learn Smart, Work Fast",
  description:
    "Your central hub for academic resources at LGU. Access past papers, assignments, and study materials to excel in your studies.",
  openGraph: {
    title: "LGU Study Hub - Learn Smart, Work Fast",
    description:
      "Join thousands of students learning smarter and working faster with LGU Study Hub.",
    type: "website",
    locale: "en_US",
    url: "https://lgu-study-hub.example.com", // Replace with your actual URL
    siteName: "LGU Study Hub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${montserrat.variable} font-body antialiased uppercase`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
