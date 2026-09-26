
import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/NavBar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "FitLog | Workout Library",
  description: "Train with intent. Log every set.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#0c0d12]">

        <NavBar />

        {children}
        
        <Toaster position="top-right" />
      </body>
    </html>
  );
}