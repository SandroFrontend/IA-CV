import * as z from "zod";
import { checkboxSchema } from "./common.validations";

export const testValidationFormSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres.").max(50, "El nombre debe tener menos de 50 caracteres.").regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]+$/, "El nombre solo puede contener letras, espacios y acentos."),
    age: z.number().min(0, "La edad debe ser mayor o igual a 0.").max(120, "La edad debe ser menor o igual a 120."),
    fecha: z.coerce.date("Fecha inválida"),
    firma: checkboxSchema,
});

export type TestValidationFormValues = z.infer<typeof testValidationFormSchema>;