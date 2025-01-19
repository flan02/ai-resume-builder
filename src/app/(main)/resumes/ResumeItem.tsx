/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import LoadingButton from "@/components/reutilizable/LoadingButton";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { formatDate } from "date-fns";
import { MoreVertical, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useReactToPrint } from "react-to-print";
import { deleteResume } from "@/server-actions/actions";

interface ResumeItemProps {
  resume: ResumeServerData
  sessionPhoto: string | undefined | null
}

export default function ResumeItem({ resume, sessionPhoto }: ResumeItemProps) {

  // const contentRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<any>(null)

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "Curriculum"
  })



  const isUpdated = resume.updatedAt !== resume.createdAt

  return (
    <div className="group relative rounded-lg border border-gray-200 dark:border-transparent bg-secondary p-3 transition-colors hover:border-border">
      <div className="space-y-3">
        <Link href={`/editor?resumeId=${resume.id}`} className="inline-block w-full text-center" >
          <p className="line-clamp-1 font-semibold td font-mono pr-4">{resume.title || "Nuevo Curriculum"}</p>
          {
            resume.description && (<p className="line-clamp-1 font-roboto text-xs text-muted-foreground">{resume.description}</p>)
          }

        </Link>
        <Link href={`/editor?resumeId=${resume.id}`} className="relative inline-block w-full" >
          <ResumePreview resumeData={mapToResumeValues(resume)} contentRef={contentRef} sessionPhoto={sessionPhoto} className="overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
      <p className="text-xs text-muted-foreground">
        {isUpdated ? "Actualizado" : "Creado"} a las{" "}
        {formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}
      </p>
      <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
    </div>
  )
}

// * This child component is used to display a dropdown menu with options to delete or print a resume
interface MoreMenuProps {
  resumeId: string
  onPrintClick: () => void
}

function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Trash2 className="size-4" />
            Eliminar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onPrintClick}
          >
            <Printer className="size-4" />
            Imprimir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        resumeId={resumeId}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      />
    </>
  )
}

// * This child component is used to display a dialog to confirm the deletion of a resume

interface DeleteConfirmationDialogProps {
  resumeId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function DeleteConfirmationDialog({ resumeId, open, onOpenChange }: DeleteConfirmationDialogProps) {

  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId)
        onOpenChange(false)
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          description: "Algo salio mal. Por favor intenta de nuevo."
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-roboto">Eliminar curriculum?</DialogTitle>
          <DialogDescription className="font-roboto">
            Esto eliminara permanentemente este curriculum. Esta accion no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton variant="destructive" onClick={handleDelete} loading={isPending} className="font-roboto">
            Eliminar
          </LoadingButton>
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="font-roboto">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}