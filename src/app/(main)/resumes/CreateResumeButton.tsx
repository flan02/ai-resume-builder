"use client";

import { Button } from "@/components/ui/button";
import { storePremiumModal } from "@/zustand/store";
import { PlusSquare } from "lucide-react";
import Link from "next/link";

interface CreateResumeButtonProps {
  canCreate: boolean
  totalCount: number
}

export default function CreateResumeButton({ canCreate, totalCount }: CreateResumeButtonProps) {

  const premiumModal = storePremiumModal() // ? it contains the state and the setter from the zustand store

  if (canCreate) {
    return (
      <Button asChild className="mx-auto flex w-fit gap-2" disabled={totalCount > 1}>
        <Link href="/editor">
          <PlusSquare className="size-5 font-mono" />
          Nuevo Curriculum
        </Link>
      </Button>
    )
  }

  return (
    <Button onClick={() => premiumModal.setOpen(true)} className="mx-auto flex w-fit gap-2" >
      <PlusSquare className="size-5 font-mono" />
      Nuevo Curriculum
    </Button>
  );
}