export const CV_RUBRIC_CRITERIA = [
  {
    id: "completitud",
    name: "Completitud de la información",
    maxPoints: 2,
    description:
      "Datos de contacto actualizados sin calle ni número, presentación de hasta tres líneas, formación reciente primero, experiencia, idiomas MCER, competencias escritas y formación complementaria relevante.",
  },
  {
    id: "claridad",
    name: "Claridad y estructura",
    maxPoints: 4,
    description:
      "Apartados diferenciados, orden cronológico inverso, títulos reconocibles, diseño limpio y homogéneo e información fácil de localizar.",
  },
  {
    id: "experiencia",
    name: "Experiencia profesional",
    maxPoints: 2,
    description:
      "Empresas, puestos técnicos, fechas, funciones y responsabilidades, herramientas utilizadas y menciones o recomendaciones relevantes.",
  },
  {
    id: "formacion",
    name: "Formación académica y complementaria",
    maxPoints: 2,
    description:
      "Titulaciones oficiales, centros, fechas, especializaciones, certificados profesionales y formación complementaria actualizada.",
  },
  {
    id: "competencias",
    name: "Competencias y conocimientos",
    maxPoints: 2,
    description:
      "Competencias técnicas y digitales, herramientas, idiomas con niveles MCER, habilidades personales y conocimientos especializados.",
  },
  {
    id: "coherencia",
    name: "Coherencia de la trayectoria",
    maxPoints: 2,
    description:
      "Coherencia y continuidad entre formación, experiencia y competencias, basándose únicamente en información explícita del CV.",
  },
  {
    id: "precision",
    name: "Precisión y calidad de la información",
    maxPoints: 4,
    description:
      "Ortografía, coherencia de fechas y datos, descripciones concretas y contrastables, sin exageraciones ni afirmaciones ambiguas.",
  },
  {
    id: "ats",
    name: "Legibilidad y compatibilidad ATS",
    maxPoints: 2,
    description:
      "Texto seleccionable, diseño preferentemente de una o dos columnas, sin información clave en imágenes, gráficos de porcentajes, tablas complejas o cuadros innecesarios y con tipografía convencional.",
  },
] as const;

export const CV_RUBRIC_TOTAL = CV_RUBRIC_CRITERIA.reduce(
  (total, criterion) => total + criterion.maxPoints,
  0,
);
