import * as z from "zod";

//const checkboxSchema = z.string().optional().transform(val => val === "on" || val === "true");
export const checkboxSchema = z.preprocess(
    (val) => {
        if (typeof val === "boolean") return val;
        if (val === "on" || val === "true") return true;
        if (val === "false" || val === "" || val === undefined || val === null) return false;
        return val;
    },
    z.boolean({
        message: "El campo debe ser un valor booleano o estar marcado.",
    })
);
