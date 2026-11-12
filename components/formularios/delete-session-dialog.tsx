"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";
import { deleteEscapareteSession } from "@/lib/actions/actions";
import { toast } from "sonner";

interface DeleteSessionDialogProps {
  id: string;
  equipo?: string;
}

export function DeleteSessionDialog({ id, equipo }: DeleteSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteEscapareteSession(id);
      if (result && result.success) {
        toast.success(result.message || "Sesión eliminada correctamente");
        setOpen(false);
      } else {
        toast.error(result?.message || "Error al eliminar la sesión");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="destructive"
            size="icon"
            aria-label={equipo ? `Eliminar sesión de ${equipo}` : "Eliminar sesión"}
            className="h-8 w-8 text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar sesión de evaluación?</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar la sesión del equipo{" "}
            {equipo ? <strong className="font-semibold text-foreground">{equipo}</strong> : "seleccionado"}?
            <br />
            Se eliminarán de forma permanente tanto los datos de la entrega como todos los ítems de la rúbrica y la fotografía asociada.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            }
          />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4 animate-spin" />
                Eliminando...
              </span>
            ) : (
              "Eliminar definitivamente"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
