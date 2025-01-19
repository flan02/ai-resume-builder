import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/reutilizable/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["100", "400", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    template: "%s - CVAI",
    absolute: "CVAI"
  },
  description: "CVAI es la forma mas faacil de crear un curriculum profesional que te ayudara a conseguir el trabajo ideal para ti",
  authors: [
    {
      name: "Dan Chanivet",
      url: "https://danchanivet.tech"
    }
  ]
}



export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`} >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
