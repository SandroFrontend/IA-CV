import Link from "next/link";
import { Check, Pencil, Plus, Search, X } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteTestDialog } from "./delete-test-dialog";

export interface TestItem {
  id: string;
  name: string;
  age: number | null;
  firma: boolean;
  fecha: Date | string;
  userId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

interface TestTableProps {
  tests: TestItem[];
}

export function TestTable({ tests }: TestTableProps) {

  const formatDate = (fecha: Date | string) => {
    try {
      return new Date(fecha).toISOString().split("T")[0];
    } catch {
      return String(fecha);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Edad</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Firma</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tests && tests.length > 0 ? (
          tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell>
                <Link
                  href={`/test/${test.id}`}
                  className="hover:underline font-medium text-foreground"
                >
                  {test.name}
                </Link>
              </TableCell>
              <TableCell>{test.age ?? "-"}</TableCell>
              <TableCell>{formatDate(test.fecha)}</TableCell>
              <TableCell>
                {test.firma ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <X className="size-4 text-red-500" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link
                    href={`/test/${test.id}?editar=true`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "icon",
                    })}
                    aria-label="Editar"
                  >
                    <Pencil />
                  </Link>
                  <DeleteTestDialog id={test.id} name={test.name} />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-6"
            >
              No hay entradas de test para mostrar
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
