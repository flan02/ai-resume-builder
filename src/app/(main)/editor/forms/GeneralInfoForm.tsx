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
import { EditorFormProps } from "@/lib/types";
import { generalInfoSchema, GeneralInfoValues } from "@/lib/validation";
import { storeAddPhoto } from "@/zustand/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function GeneralInfoForm({ resumeData, setResumeData }: EditorFormProps) {
  const addPhoto = storeAddPhoto();
  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: resumeData.title || "",
      description: resumeData.description || ""
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData])

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold font-mono td">Informacion General</h2>
        <p className="text-sm text-muted-foreground font-roboto">
          Estos datos no apareceran en tu curriculum.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold font-roboto td">Nombre del Proyecto</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="mi curriculum" autoFocus className="text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold font-roboto td">Descripcion</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ej: curriculum para trabajos part-time" className="text-muted-foreground" />
                </FormControl>
                <FormDescription className="pt-2 font-roboto">
                  Describe para que posiciones utilizaras este curriculum.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="flex flex-col space-y-2">
        <p className="font-bold font-roboto text-sm td">Imagen</p>
        <Button className="text-sm w-min px-1.5" variant={addPhoto.showImage ? "default" : "premium"} onClick={() => addPhoto.setShowImage(!addPhoto.showImage)}>
          {
            addPhoto.showImage
              ? "Ocultar"
              : "Agregar"
          }
        </Button>
        <h6 className="text-xs text-muted-foreground font-roboto">Generada via Google o Github al iniciar sesion.</h6>
      </div>
    </div>
  );
}