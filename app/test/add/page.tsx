import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardAction } from "@/components/ui/card";
import { TestForm } from "@/components/formularios/testform/testform";
import { Home, TestTubeDiagonal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function TestAddPage() {
    return (
        <Card className="w-full max-w-2xl mx-auto my-auto">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Agregar Test</CardTitle>
                <CardDescription className="text-muted-foreground">Formulario para agregar un nuevo test</CardDescription>
                <CardAction>
                    <Link href={'/test'} className={buttonVariants({ variant: "link", size: "icon" })} > <TestTubeDiagonal /></Link>
                    <Link href={'/'} className={buttonVariants({ variant: "link", size: "icon" })} > <Home /></Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <TestForm />
            </CardContent>
        </Card>
    )
}