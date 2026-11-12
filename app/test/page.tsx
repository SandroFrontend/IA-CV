import { getAllTests } from "@/lib/actions/test.action";
import Link from "next/link";
import { TestTable } from "@/components/formularios/testform/test-table";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SearchField from "@/components/formularios/testform/search-field";
import { PaginationControls } from "@/components/formularios/testform/pagination-controls";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; pageSize?: string }>;
}) {
  const { search, page, pageSize } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentPageSize = Number(pageSize) || 5;

  const { tests, total, totalPages } = await getAllTests({
    search: search || "",
    page: currentPage,
    pageSize: currentPageSize,
  });

  return (
    <Card className="w-full max-w-2xl mx-auto my-auto p-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Lista de Test</CardTitle>
        <CardDescription>Gestiona las entradas de tests</CardDescription>
        <CardAction className="flex flex-wrap items-center gap-2">
          <SearchField value={search || ""} nbrItems={total} />
          <Link href={"/test/add"} className={buttonVariants({ variant: "default" })}>
            <Plus />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <TestTable tests={tests} />
      </CardContent>
      <CardFooter>
        <PaginationControls
          page={currentPage}
          pageSize={currentPageSize}
          totalPages={totalPages}
          total={total}
        />
      </CardFooter>
    </Card>
  );
}