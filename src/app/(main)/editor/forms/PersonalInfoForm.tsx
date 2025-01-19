/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { personalInfoSchema, PersonalInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function PersonalInfoForm({ resumeData, setResumeData }: EditorFormProps) {


  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      //photoUrl: resumeData.photoUrl || "",
      firstName: resumeData.firstName || "",
      lastName: resumeData.lastName || "",
      jobTitle: resumeData.jobTitle || "",
      city: resumeData.city || "",
      country: resumeData.country || "",
      phone: resumeData.phone || "",
      email: resumeData.email || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return

      setResumeData({ ...resumeData, ...values }) // ? Update resume data
    });
    return unsubscribe // ? unsubscribe from the watch before the component unmounts and create a new one
  }, [form, resumeData, setResumeData])

  // const photoInputRef = useRef<HTMLInputElement>(null) // - in case you need to add a file input field
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.setAttribute("readonly", "true");
    setTimeout(() => {
      e.target.removeAttribute("readonly");
    }, 100); // Esto evita que el autocompletado se active
  };
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold td font-mono">Informacion Personal</h2>
        <p className="text-sm text-muted-foreground font-roboto">Escribe sobre ti mismo.</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold td">Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-muted-foreground" onFocus={handleFocus} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="td font-bold">Apellido</FormLabel>
                  <FormControl aria-autocomplete="none">
                    <Input {...field} className="text-muted-foreground" onFocus={handleFocus} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="td font-bold">Titulo del puesto</FormLabel>
                <FormControl>
                  <Input {...field} className="text-muted-foreground" onFocus={handleFocus} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold td">Provincia</FormLabel>
                  <FormControl>
                    <Input {...field} onFocus={handleFocus} className="text-muted-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold td">Pais</FormLabel>
                  <FormControl>
                    <Input {...field} onFocus={handleFocus} className="text-muted-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold td">Telefono</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" className="text-muted-foreground" onFocus={handleFocus} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold td">Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" onFocus={handleFocus} className="text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

// - In case you need to add a file input field, you can use the following code:
{/* <FormField
            control={form.control}
            name="photo"
            render={({ field: { value, ...fieldValues } }) => (
              <FormItem>
                <FormLabel>Tu imagen</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        fieldValues.onChange(file)
                      }}
                      ref={photoInputRef}
                    />
                  </FormControl>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      fieldValues.onChange(null)
                      if (photoInputRef.current) {
                        photoInputRef.current.value = ""
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          /> */}