'use client'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { workExperienceSchema, WorkExperienceValues } from "@/lib/validation";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import GenerateWorkExperienceButton from "./GenerateWorkExperienceButton";

export default function WorkExperienceForm({ resumeData, setResumeData }: EditorFormProps) {

  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperiences: resumeData.workExperiences || []
    }
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        workExperiences: values.workExperiences?.filter((exp) => exp !== undefined) || [],
      })
    })
    return unsubscribe
  }, [form, resumeData, setResumeData])

  // ? useFieldArray is a hook provided by react-hook-form
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "workExperiences"
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id)
      const newIndex = fields.findIndex((field) => field.id === over.id)
      move(oldIndex, newIndex)
      return arrayMove(fields, oldIndex, newIndex)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold font-mono">Experiencia Laboral</h2>
        <p className="text-sm text-muted-foreground font-roboto">
          Agrega todos los trabajos que hayas realizado.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={fields} strategy={verticalListSortingStrategy} >
              {
                fields.map((field, index) => (
                  <WorkExperienceItem
                    id={field.id}
                    key={field.id}
                    index={index}
                    form={form}
                    remove={remove}
                  />
                ))
              }
            </SortableContext>
          </DndContext>

          <div className="flex justify-center">
            <Button
              className="font-roboto"
              type="button"
              onClick={() =>
                append({
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
            >
              Agregar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface WorkExperienceItemProps {
  id: string;
  form: UseFormReturn<WorkExperienceValues>;
  index: number;
  remove: (index: number) => void;
}

function WorkExperienceItem({ id, form, index, remove }: WorkExperienceItemProps) {

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      className={cn(
        "space-y-3 rounded-md border bg-background p-3",
        isDragging && "relative z-50 cursor-grab shadow-xl"
      )}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold font-mono text-xs lg:text-md">Experiencia laboral {index + 1}</span>
        <GripHorizontal className="size-5 cursor-grab text-muted-foreground focus:outline-none" {...attributes} {...listeners} />
      </div>

      <div className="flex justify-center">
        <GenerateWorkExperienceButton
          onWorkExperienceGenerated={(exp) => form.setValue(`workExperiences.${index}`, exp)}
        />
      </div>

      <FormField
        control={form.control}
        name={`workExperiences.${index}.position`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-roboto font-bold td text-xs lg:text-md">Titulo del Puesto</FormLabel>
            <FormControl>
              <Input {...field} autoFocus className="text-muted-foreground text-xs lg:text-md" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`workExperiences.${index}.company`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-roboto font-bold td text-xs lg:text-md">Empresa</FormLabel>
            <FormControl>
              <Input {...field} className="text-muted-foreground text-xs lg:text-md" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`workExperiences.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-roboto font-bold td text-xs lg:text-md">Fecha de Inicio</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                  className="text-muted-foreground text-xs lg:text-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`workExperiences.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-roboto font-bold td text-xs lg:text-md">Fecha de Finalizacion</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                  className="text-muted-foreground text-xs lg:text-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormDescription className="font-roboto text-muted-foreground text-xs lg:text-md">
        Deja la <span className="font-semibold">fecha de finalizacion</span> sin completar si
        actualmente continuas en este trabajo.
      </FormDescription>

      <FormField
        control={form.control}
        name={`workExperiences.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="td font-bold text-xs lg:text-md">Descripcion</FormLabel>
            <FormControl>
              <Textarea {...field} className="text-muted-foreground font-roboto text-xs lg:text-md" rows={6} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button className="text-xs px-1.5" variant="destructive" type="button" onClick={() => remove(index)}>
        Eliminar
      </Button>
    </div>
  );
}