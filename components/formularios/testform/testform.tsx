"use client"
import { useActionState, useEffect, startTransition } from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { testValidationFormSchema, TestValidationFormValues } from "@/lib/validations/test.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { addTest, editTest } from "@/lib/actions/test.action"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { FieldGroup, FieldSet } from "@/components/ui/field"
import { AlertCircle, Save } from "lucide-react"
import { FormElement } from "../form-element"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "cn"

const testDefaultValues: TestValidationFormValues = {
    name: "",
    age: 0,
    fecha: new Date(),
    firma: false,
};

interface TestFormProps {
    testId?: string;
    test?: TestValidationFormValues;
    editar?: boolean;
}


export function TestForm({ testId, test, editar }: TestFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const currentTest = testId ? test : testDefaultValues;
    const initState = {
        success: false,
        message: "",
        data: undefined,
        errors: {},
    };
    const accion = editar && testId ? editTest.bind(null, testId) : addTest;
    const [state, formAction, isPendingAction] = useActionState(accion, initState);

    //Observar al retornar el action si hay errores o éxito antes de volver a cargar el formulario
    useEffect(() => {
        if (state.success && state.id) {
            toast.success(state.message)
            router.push(`/test/${state.id}`)
        } else if (state.message !== "") toast.error(state.message)
    }, [state.success, state.id, router])

    const methods = useForm<TestValidationFormValues>({
        resolver: zodResolver(testValidationFormSchema) as any,
        defaultValues: currentTest
    });

    // Inyección de los errores en servidor
    useEffect(() => {
        if (state.errors) {
            Object.entries(state.errors).forEach(([field, messages]) => {
                if (field !== "additional" && messages && messages.length > 0) {
                    methods.setError(field as any, {
                        type: "server",
                        message: messages[0],
                    });
                }
            });
        }
    }, [state.errors, methods]);

    //Envio del botón submit configurado en form
    const onSubmit = async (data: TestValidationFormValues) => {
        startTransition(() => formAction(data))
    }


    return (
        <>
            {editar && <div className="text-left mb-4 text-primary text-lg">Editar entrada Test</div>}
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                    <FieldGroup>
                        {/* Error Message */}
                        <div
                            className={cn(
                                "p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800",
                                state.errors?.additional ? "block" : "hidden"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                <span>{state.errors?.additional?.join(", ")}</span>
                            </div>
                        </div>
                        <FieldSet>
                            <FormElement<TestValidationFormValues> name="name" label="Nombre" type="text" placeholder="Introduzca el nombre del test" />
                            <FormElement<TestValidationFormValues> name="age" label="Edad" type="number" placeholder="Introduzca la edad" />
                            <FormElement<TestValidationFormValues> name="fecha" label="Fecha" type="date" placeholder="Introduzca la fecha" />
                            <FormElement<TestValidationFormValues> name="firma" label="Firma" type="checkbox" />
                        </FieldSet>
                    </FieldGroup>
                    {(editar || pathname === "/test/add") && <FieldSet>
                        <Button type="submit" disabled={isPendingAction} variant="default">
                            {isPendingAction ?
                                <div className="flex">
                                    <Spinner className="animate-spin" />Guardando...
                                </div> : <div className="flex">
                                    <Save className="mx-4" />Guardar
                                </div>}
                        </Button>
                    </FieldSet>}
                </form>
            </FormProvider>
        </>
    )
}