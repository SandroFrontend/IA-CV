"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "cn";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
    pageSizeOptions?: number[];
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    if (currentPage <= 3) {
        pages.push(1, 2, 3, "ellipsis", totalPages);
    } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
    } else {
        pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
    }

    return pages;
}

export function PaginationControls({
    page,
    pageSize,
    totalPages,
    total,
    pageSizeOptions = [2, 5, 10, 20, 50],
}: PaginationControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(pageNumber));
        return `${pathname}?${params.toString()}`;
    };

    const handlePageSizeChange = (newSize: string | null) => {
        if (!newSize) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1"); // Reinicia a la primera página al cambiar el tamaño
        params.set("pageSize", newSize);
        router.push(`${pathname}?${params.toString()}`);
    };

    const startRecord = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const endRecord = Math.min(page * pageSize, total);
    const pageNumbers = getPageNumbers(page, totalPages);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full text-sm text-muted-foreground">
            {/* Selector de tamaño de página y contador */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <span>Filas por página:</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="w-18 h-8" size="sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start">
                            {pageSizeOptions.map((opt) => (
                                <SelectItem key={opt} value={String(opt)}>
                                    {opt}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <span>
                    {startRecord}-{endRecord} de {total}
                </span>
            </div>

            {/* Componente Shadcn Pagination */}
            <Pagination className="w-auto mx-0">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={createPageURL(Math.max(1, page - 1))}
                            text=""
                            aria-label="Página anterior"
                            aria-disabled={page <= 1}
                            tabIndex={page <= 1 ? -1 : undefined}
                            className={cn(
                                "size-8 p-0",
                                page <= 1 && "pointer-events-none opacity-50"
                            )}
                        />
                    </PaginationItem>

                    {pageNumbers.map((p, idx) =>
                        p === "ellipsis" ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    href={createPageURL(p)}
                                    isActive={p === page}
                                    size="icon-sm"
                                    className="size-8"
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href={createPageURL(Math.min(totalPages, page + 1))}
                            text=""
                            aria-label="Página siguiente"
                            aria-disabled={page >= totalPages}
                            tabIndex={page >= totalPages ? -1 : undefined}
                            className={cn(
                                "size-8 p-0",
                                page >= totalPages && "pointer-events-none opacity-50"
                            )}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
