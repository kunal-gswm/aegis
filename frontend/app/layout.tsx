import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AegisAI | LLM Red-Teaming Platform",
  description: "Enterprise-grade AI Security & LLM Red-Teaming Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-black text-slate-200">
        {children}
      </body>
    </html>
  );
}
