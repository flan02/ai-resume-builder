//'use client'
import SignOut from "@/components/reutilizable/sign-out";
//import logo from "../../../public/logo.png";
import ThemeToggle from "@/components/reutilizable/ThemeToggle";
import { BrainIcon } from "lucide-react";

//import { useTheme } from "next-themes";
//import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  //const { theme } = useTheme();

  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-3 p-3">
        <Link href="/resumes" className="flex items-center gap-2 dark:td">
          {/* <Image
            src={logo}
            alt="Logo"
            width={35}
            height={35}
            className="rounded-full"
          /> */}
          <BrainIcon />
          <h2 className="text-xs lg:text-xl dark:td font-bold font-mono tracking-tight">
            CVAI potenciador de talentos
          </h2>
        </Link>
        <div className="flex items-center space-x-6">
          <SignOut />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}