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
import { deleteTest } from "@/lib/actions/test.action";
import { toast } from "sonner";

interface DeleteTestDialogProps {
  id: string;
  name?: string;
}

export function DeleteTestDialog({ id, name }: DeleteTestDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTest(id);
      if (result && result.success) {
        toast.success(result.message || "Test eliminado correctamente");
        setOpen(false);
      } else {
        toast.error(result?.message || "Error al eliminar el test");
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
            aria-label={name ? `Eliminar ${name}` : "Eliminar test"}
          >
            <Trash2 />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar test?</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar{" "}
            {name ? <strong className="font-semibold text-foreground">{name}</strong> : "esta entrada"}?
            {" "}Esta acción no se puede deshacer.
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
              "Eliminar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
