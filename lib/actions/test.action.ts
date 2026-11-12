"use server";

import { prisma } from "@/lib/prisma";
import type { Test } from "@/lib/types";
import { TestValidationFormValues, testValidationFormSchema } from "@/lib/validations/test.validation";
import { headers } from "next/headers";

export type TestFormState = {
    success: boolean;
    message: string;
    errors?: { [K in keyof TestValidationFormValues]?: string[] } & { additional?: string[] };
    data?: Partial<TestValidationFormValues>;
    id?: string;
}

export async function addTest(
    prevState: TestFormState,
    data: TestValidationFormValues
): Promise<TestFormState> {

    //Validar que existen datos de sesión en los headers
    // const headersList = await headers();
    // const userId = headersList.get("x-user-id");
    // if (!userId) {
    //     return {
    //         success: false,
    //         message: "Usuario no autenticado",
    //     };
    // }
    const userId = "fcuestas"

    //Comprobar la validez de los datos enviados
    const validatedFields = testValidationFormSchema.safeParse(data);
    console.log(validatedFields)
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Datos no válidos",
            errors: validatedFields.error.flatten((issue) => issue.message).fieldErrors,
        };
    }
    try {
        const result = await prisma.test.create({
            data: { ...validatedFields.data, userId },
        });
        return {
            success: true,
            message: "Test creado correctamente",
            id: result.id,
        };
    } catch (error) {
        console.error("Error al crear episodio:", error);
        return {
            success: false,
            message: "Error al guardar el episodio en la base de datos",
            errors: {
                additional: ["Error al guardar en la base de datos"]
            }
        }
    }
}

export async function editTest(
    id: string,
    prevState: TestFormState,
    data: TestValidationFormValues
): Promise<TestFormState> {

    //Validar que existen datos de sesión en los headers
    // const headersList = await headers();
    // const userId = headersList.get("x-user-id");
    // if (!userId) {
    //     return {
    //         success: false,
    //         message: "Usuario no autenticado",
    //     };
    // }
    const userId = "fcuestas"

    //Comprobar la validez de los datos enviados
    const validatedFields = testValidationFormSchema.safeParse(data);
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Datos no válidos",
            errors: validatedFields.error.flatten((issue) => issue.message).fieldErrors,
        };
    }
    try {
        const result = await prisma.test.update({
            where: { id },
            data: { ...validatedFields.data, userId },
        });
        return {
            success: true,
            message: "Test editado correctamente",
            id: result.id,
        };
    } catch (error) {
        console.error("Error al editar episodio:", error);
        return {
            success: false,
            message: "Error al editar el episodio en la base de datos",
            errors: {
                additional: ["Error al editar en la base de datos"]
            }
        }
    }
}

import { revalidatePath } from "next/cache";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getTestById(id: string) {
    if (!UUID_REGEX.test(id)) {
        return null;
    }
    try {
        const test = await prisma.test.findUnique({ where: { id } });
        return test;
    } catch (error) {
        console.error("Error al obtener test:", error);
        return null;
    }
}

export async function deleteTest(id: string) {
    if (!UUID_REGEX.test(id)) {
        return { success: false, message: "ID no válido" };
    }
    try {
        const test = await prisma.test.delete({ where: { id } });
        revalidatePath("/");
        return { success: true, message: "Test eliminado correctamente", data: test };
    } catch (error) {
        console.error("Error al eliminar test:", error);
        return { success: false, message: "Error al eliminar el test" };
    }
}

export interface GetAllTestsParams {
    search?: string;
    page?: number;
    pageSize?: number;
}

export interface GetAllTestsResult {
    tests: Test[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
}

export async function getAllTests(
    params?: string | GetAllTestsParams
): Promise<GetAllTestsResult> {
    const search = typeof params === "string" ? params : params?.search || "";
    const page = typeof params === "object" && params?.page ? Math.max(1, Number(params.page) || 1) : 1;
    const pageSize = typeof params === "object" && params?.pageSize ? Math.max(1, Number(params.pageSize) || 10) : 10;
    const skip = (page - 1) * pageSize;

    try {
        const where: { [key: string]: any } = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } }
            ];
        }

        const [total, tests] = await prisma.$transaction([
            prisma.test.count({ where }),
            prisma.test.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        const totalPages = Math.max(1, Math.ceil(total / pageSize));

        return {
            tests,
            total,
            totalPages,
            page,
            pageSize,
        };
    } catch (error) {
        console.error("Error al obtener tests:", error);
        return {
            tests: [],
            total: 0,
            totalPages: 1,
            page: 1,
            pageSize: 10,
        };
    }
}

