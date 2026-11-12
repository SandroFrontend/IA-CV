export { cn } from "cn"

//Formatear fechas para campos Date de formularios
export const formatDateForInput = (value: any) => {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

/**
 * Normaliza la ruta de un recurso estático (p.ej. /uploads/...)
 * anteponiendo el basePath si está configurado (NEXT_PUBLIC_BASE_PATH o /escaparametro)
 */
export const getAssetUrl = (pathStr: string): string => {
    if (!pathStr) return "";
    if (pathStr.startsWith("http://") || pathStr.startsWith("https://") || pathStr.startsWith("data:")) {
        return pathStr;
    }
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/escaparametro";
    let cleanPath = pathStr.startsWith("/") ? pathStr : `/${pathStr}`;

    // Si la ruta apunta a /uploads/..., la servimos a través del route handler /api/uploads/...
    if (cleanPath.startsWith("/uploads/")) {
        cleanPath = `/api${cleanPath}`;
    }

    if (basePath && !cleanPath.startsWith(basePath)) {
        return `${basePath}${cleanPath}`;
    }
    return cleanPath;
};