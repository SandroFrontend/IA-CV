import { Controller, useFormContext, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { formatDateForInput } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea";

//Componente genérido para realizar elementos de un formulario usando FormProvider de react-hook-form

// Definimos las props usando un genérico <T> que hereda de FieldValues (los tipos de Zod)
interface FormInputProps<T extends FieldValues> {
    name: Path<T>; // Esto fuerza a que 'name' sea un campo real del Schema
    label: string;
    type: "text" | "number" | "checkbox" | "select" | "date" | "textarea";
    placeholder?: string;
    options?: { label: string; value: string }[]; // Solo para el tipo 'select'
    disabled?: boolean;
}

export function FormElement<T extends FieldValues>({
    name,
    label,
    type,
    placeholder,
    options,
    disabled = false
}: FormInputProps<T>) {
    const { control, formState: { errors } } = useFormContext<T>()
    const error = errors[name]
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field orientation={type === "checkbox" ? "horizontal" : "vertical"}>
                    {type === "checkbox" && (
                        <Checkbox
                            id={name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                        />
                    )}
                    <FieldLabel>{label}</FieldLabel>

                    {/* RENDERIZADO CONDICIONAL SEGÚN EL TIPO */}
                    {type === "text" && (
                        <Input {...field} value={field.value ?? ""} aria-invalid={fieldState.invalid} placeholder={placeholder} disabled={disabled} />
                    )}

                    {type === "number" && (
                        <Input
                            {...field}
                            type="number"
                            value={Number.isNaN(field.value) ? "" : (field.value ?? "")}
                            aria-invalid={fieldState.invalid}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)} // Convierte a número para Zod
                            placeholder={placeholder}
                            disabled={disabled}
                        />
                    )}

                    {type === "date" && (
                        <Input
                            {...field}
                            type="date"
                            aria-invalid={fieldState.invalid}
                            value={formatDateForInput(field.value)}
                            disabled={disabled}
                        />
                    )}

                    {type === "select" && (
                        <Select onValueChange={field.onChange} value={field.value} aria-invalid={fieldState.invalid}>
                            <SelectTrigger disabled={disabled}>
                                <SelectValue placeholder={placeholder || "Selecciona..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {options?.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {type === "textarea" && (
                        <Textarea {...field}
                            value={field.value ?? ""}
                            aria-invalid={fieldState.invalid}
                            placeholder={placeholder}
                            disabled={disabled}
                            className="w-full text-base"
                        />
                    )}

                    {/* MUESTRA EL ERROR SI EXISTE */}
                    {error && (
                        <FieldError>
                            {String(error.message)}
                        </FieldError>
                    )}
                </Field>
            )}
        />
    )
}