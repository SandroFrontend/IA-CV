export const CV_SECTORS = [
  "Administración y Finanzas",
  "Comercio y Marketing",
  "Educación",
  "Hostelería y Turismo",
  "Informática y Comunicaciones",
  "Industria y Construcción",
  "Recursos Humanos",
  "Sanidad",
  "Transporte y Logística",
  "Atención al cliente",
  "Otros",
] as const;

export const CV_FIXED_SECTORS = CV_SECTORS.filter((sector) => sector !== "Otros");
