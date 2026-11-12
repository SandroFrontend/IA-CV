import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { TestForm } from "@/components/formularios/testform/testform";
import { getTestById } from "@/lib/actions/test.action";
import { notFound } from "next/navigation";
import { TestValidationFormValues } from "@/lib/validations/test.validation";
import { Home } from "lucide-react";

export default async function TestPage({ params, searchParams }: {
    params: Promise<{ testId: string }>
    searchParams: Promise<{ editar?: string }>
}) {
    const { testId } = await params;
    const test = await getTestById(testId) as TestValidationFormValues;
    if (!test) {
        return notFound();
    }
    const editar = (await searchParams).editar === "true" ? true : false;
    console.log("editar: ", editar);
    return (
        <Card className="flex flex-col gap-4 w-full max-w-2xl mx-auto my-auto">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Detalle de Test</CardTitle>
                <CardDescription>Detalles del test seleccionado</CardDescription>
                <CardAction>
                    <Link href="/"
                        className={buttonVariants({ variant: "link", size: "icon" })} >
                        <Home />
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <TestForm
                    testId={testId}
                    test={test}
                    editar={editar}
                />
            </CardContent>
        </Card>
    )
}