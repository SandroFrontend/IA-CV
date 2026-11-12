"use client"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"

interface SearchFieldProps {
    value: string;
    nbrItems?: number;
}

export default function SearchField({
    value = "",
    nbrItems = 0
}: SearchFieldProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>(value)

    // Keep local input in sync if URL search param changes (e.g. back/forward navigation)
    useEffect(() => {
        setSearchTerm(value)
    }, [value]);

    const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        const query = searchTerm.trim();
        if (query) {
            params.set("search", query);
        } else {
            params.delete("search");
        }
        params.set("page", "1"); // Reiniciar a la primera página al buscar

        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <form onSubmit={handleSearch}>
            <InputGroup className="max-w-xs">
                <InputGroupInput
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                    {nbrItems} {nbrItems === 1 ? "resultado" : "resultados"}
                </InputGroupAddon>
            </InputGroup>
        </form>
    )
}