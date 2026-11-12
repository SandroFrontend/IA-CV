import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QrCode } from "lucide-react";

export default function BotonQRGen({
    codigo,
    actividad,
    puntos
}: {
    codigo: string,
    actividad: string,
    puntos: number,
}) {
    const enpoint = process.env.NEXT_PUBLIC_QRGEN_ENDPOINT || "https://feria.ausiasmarch.net/qrgen";
    return (
        <div className="flex justify-end mb-4">
            <Link
                href={`${enpoint}?codigo=${codigo}&actividad=${actividad}&puntos=${puntos}`}
                className={cn(buttonVariants({ variant: "outline" }), "gap-1")}
            >
                <QrCode className="mr-2 size-4" />
                Generar QR
            </Link>
        </div>
    );
}