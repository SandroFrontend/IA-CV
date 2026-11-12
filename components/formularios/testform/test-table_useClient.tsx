"use client";
import { useMemo, useState } from "react";
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
  const [search, setSearch] = useState("");

  const filteredTests = useMemo(() => {
    if (!search.trim()) return tests;
    const term = search.toLowerCase().trim();
    return tests.filter((test) => {
      const formattedDate = new Date(test.fecha).toISOString().split("T")[0];
      return (
        test.name.toLowerCase().includes(term) ||
        test.age?.toString().includes(term) ||
        formattedDate.includes(term)
      );
    });
  }, [tests, search]);

  const formatDate = (fecha: Date | string) => {
    try {
      return new Date(fecha).toISOString().split("T")[0];
    } catch {
      return String(fecha);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-auto p-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Lista de Test</CardTitle>
        <CardDescription>Gestiona las entradas de tests</CardDescription>
        <CardAction className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-52">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar test..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-8 h-8 text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <Link
            href="/add"
            className={buttonVariants({ variant: "default" })}
          >
            <Plus />
            Agregar Test
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
            {filteredTests && filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell>
                    <Link
                      href={`/${test.id}`}
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
                        href={`/${test.id}?editar=true`}
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
                  {search.trim()
                    ? `No se encontraron tests que coincidan con "${search}"`
                    : "No hay entradas de test para mostrar"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
