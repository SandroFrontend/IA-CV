export interface QuestionItem {
  id: string;
  category: string;
  question: string;
  options: [string, string, string, string]; // Tupla fija de 4 opciones
  correctIndex: 0 | 1 | 2 | 3;             // Índice exacto de la respuesta correcta (0 = A, 1 = B, 2 = C, 3 = D)
  explanation: string;
}

export const LAB_QUESTIONS: QuestionItem[] = [
  // --- Bloque 1: Cifras e impacto asistencial ---
  {
    id: "q01",
    category: "Impacto Asistencial",
    question: "¿Qué porcentaje de las decisiones médicas diagnósticas y de tratamiento dependen directamente de los resultados del laboratorio?",
    options: [
      "Entre el 10% y el 20%",
      "Alrededor del 35%",
      "Aproximadamente el 70%",
      "Más del 95%"
    ],
    correctIndex: 2,
    explanation: "Aunque representan menos del 5% del presupuesto hospitalario, las pruebas de laboratorio fundamentan alrededor del 70% de las decisiones clínicas."
  },
  {
    id: "q02",
    category: "Sanidad Valenciana",
    question: "En un gran hospital de referencia valenciano (como La Fe o el Clínico), ¿cuántas determinaciones analíticas pueden llegar a procesarse al día?",
    options: [
      "Entre 500 y 1.000",
      "Entre 2.000 y 4.000",
      "Más de 15.000 a 30.000",
      "Alrededor de 150.000"
    ],
    correctIndex: 2,
    explanation: "Los analizadores centrales de alta capacidad de los hospitales metropolitanos absorben diariamente decenas de miles de pruebas procedentes de urgencias, plantas y centros de salud."
  },
  {
    id: "q03",
    category: "Prevención y Cribado",
    question: "¿En qué magnitud puede reducirse la mortalidad por cáncer de colon gracias a programas de cribado de sangre oculta en heces?",
    options: [
      "Entre un 5% y un 8%",
      "Entre un 15% y un 35%",
      "Exactamente un 75%",
      "No afecta a la mortalidad, solo al coste"
    ],
    correctIndex: 1,
    explanation: "Detectar lesiones premalignas o en estadios iniciales en el laboratorio reduce la mortalidad específica entre un 15% y más de un 30%."
  },
  {
    id: "q04",
    category: "Urgencias",
    question: "¿Cuál es el tiempo medio habitual en el que un laboratorio de urgencias hospitalario emite una analítica crítica vital (gasometría o troponina)?",
    options: [
      "Menos de 10 a 20 minutos",
      "Alrededor de 2 horas",
      "Unas 6 horas",
      "24 horas laborables"
    ],
    correctIndex: 0,
    explanation: "Los analizadores de respuesta rápida permiten tomar decisiones inmediatas en paradas cardiorrespiratorias o sospechas de infarto en menos de 15 minutos."
  },

  // --- Bloque 2: Pruebas rápidas y Point of Care ---
  {
    id: "q05",
    category: "Point of Care",
    question: "¿Cuál fue el primer test diagnóstico masivo diseñado para realizarse de forma autónoma en el hogar?",
    options: [
      "El glucómetro capilar",
      "El test de embarazo en orina con tiras reactivas",
      "El test de antígenos para la gripe",
      "El test de colesterol en saliva"
    ],
    correctIndex: 1,
    explanation: "En los años 70 se popularizó el primer test casero de embarazo basado en la detección de la hormona hCG por inmunocromatografía."
  },
  {
    id: "q06",
    category: "Farmacia y Autocontrol",
    question: "¿Qué tipo de prueba rápida bioquímica es la más habitual y contrastada en una oficina de farmacia comunitaria?",
    options: [
      "Secuenciación masiva de ADN",
      "Perfil lipídico y glucosa en sangre capilar por química seca",
      "Cultivo microbiológico con antibiograma",
      "Biopsia líquida"
    ],
    correctIndex: 1,
    explanation: "Los dispositivos de química seca permiten medir glucemia, colesterol total y triglicéridos con una simple punción digital en cuestión de 3 a 5 minutos."
  },
  {
    id: "q07",
    category: "Tecnología Diagnóstica",
    question: "¿Qué principio físico permite que los test rápidos de antígenos muestren bandas visibles en 15 minutos sin electricidad?",
    options: [
      "Resonancia magnética miniaturizada",
      "Inmunocromatografía de flujo lateral con nanopartículas de oro o látex",
      "Reacción en cadena de la polimerasa en frío",
      "Microcentrifugación capilar"
    ],
    correctIndex: 1,
    explanation: "La muestra migra por capilaridad sobre una tira de nitrocelulosa, atrapando el antígeno entre anticuerpos acoplados a partículas de oro coloidal reflectantes."
  },

  // --- Bloque 3: Instrumentación y Equipamiento ---
  {
    id: "q08",
    category: "Equipamiento",
    question: "¿A qué velocidad puede llegar a girar una ultracentrífuga de laboratorio para separar orgánulos o ácidos nucleicos?",
    options: [
      "A 500 revoluciones por minuto (rpm)",
      "A 2.000 rpm",
      "A más de 70.000 - 100.000 rpm",
      "A 1.000.000 rpm"
    ],
    correctIndex: 2,
    explanation: "Las ultracentrífugas trabajan al vacío y superan las 80.000 rpm, generando campos gravitatorios cientos de miles de veces superiores a la gravedad terrestre."
  },
  {
    id: "q09",
    category: "Equipamiento",
    question: "¿Qué técnica óptica emplea el citómetro de flujo para caracterizar y contar miles de células por segundo?",
    options: [
      "Emisión de rayos X",
      "Haces de láser y detectores de fluorescencia y dispersión",
      "Ondas de ultrasonido",
      "Pesaje en microbalanzas"
    ],
    correctIndex: 1,
    explanation: "Las células circulan alineadas ante un láser que mide tanto el tamaño (FSC) como la complejidad interna (SSC) y fluorocromos asociados."
  },
  {
    id: "q10",
    category: "Microbiología Rápida",
    question: "¿Qué analizador revolucionó la microbiología clínica al identificar bacterias en 5 minutos a partir de su perfil proteico?",
    options: [
      "El microscopio de luz transmitida",
      "El espectrómetro de masas MALDI-TOF",
      "El autoclave de vapor",
      "El baño de agua termostatizado"
    ],
    correctIndex: 1,
    explanation: "El MALDI-TOF ioniza proteínas celulares mediante pulsos láser y compara su masa y tiempo de vuelo con una base de datos de especies bacterianas."
  },
  {
    id: "q11",
    category: "Fase Preanalítica",
    question: "¿Por qué los tubos de extracción sanguínea tienen tapones estandarizados con colores específicos (lila, azul, verde, rojo)?",
    options: [
      "Por estética corporativa del centro",
      "Para indicar qué aditivo o anticoagulante químico contienen",
      "Para clasificar la muestra según el grupo sanguíneo",
      "Para distinguir el sexo biológico del paciente"
    ],
    correctIndex: 1,
    explanation: "El código de colores codifica el aditivo: lila para EDTA (hematología), azul para citrato sódico (coagulación), verde para heparina y rojo/amarillo para gel separador de suero."
  },

  // --- Bloque 4: Hematología y Bioquímica ---
  {
    id: "q12",
    category: "Hematología",
    question: "En una sola gota de sangre (aproximadamente 50 microlitros), ¿cuántos glóbulos rojos hay aproximadamente?",
    options: [
      "Alrededor de 1.000",
      "Cerca de 50.000",
      "Unos 250 millones",
      "Más de 10 billones"
    ],
    correctIndex: 2,
    explanation: "Al haber entre 4,5 y 5 millones de eritrocitos por microlitro de sangre, una gota normal contiene unos 250 millones de células transportadoras de oxígeno."
  },
  {
    id: "q13",
    category: "Hematología",
    question: "¿Por qué los eritrocitos maduros de los mamíferos carecen de núcleo y mitocondrias?",
    options: [
      "Porque los expulsan tras sufrir una lesión",
      "Para maximizar el volumen ocupado por hemoglobina y no consumir el oxígeno transportado",
      "Porque se duplican fuera del organismo",
      "Para evitar ser detectados por el sistema inmunitario"
    ],
    correctIndex: 1,
    explanation: "Al perder el núcleo y organelas, el eritrocito optimiza su espacio para albergar millones de moléculas de hemoglobina y no gasta el oxígeno que traslada."
  },
  {
    id: "q14",
    category: "Hematología",
    question: "¿Cuánto tiempo vive por término medio un glóbulo rojo antes de ser destruido y reciclado en el bazo?",
    options: [
      "24 horas",
      "7 a 10 días",
      "Aproximadamente 120 días",
      "Toda la vida del individuo"
    ],
    correctIndex: 2,
    explanation: "Tras unos 4 meses de circulación mecánica por el árbol vascular, los hematíes envejecidos son reconocidos y fagocitados por macrófagos del sistema mononuclear fagocítico."
  },
  {
    id: "q15",
    category: "Biomarcadores Cardíacos",
    question: "¿Qué biomarcador es el estándar de referencia en el laboratorio para confirmar la existencia de necrosis por infarto de miocardio?",
    options: [
      "Troponina I o T de alta sensibilidad",
      "Amilasa pancreática",
      "Fosfatasa alcalina",
      "Lipasa sérica"
    ],
    correctIndex: 0,
    explanation: "La troponina es una proteína estructural del miocito cardíaco; su liberación al torrente es el criterio analítico cardinal en el síndrome coronario agudo."
  },
  {
    id: "q16",
    category: "Bioquímica",
    question: "¿Qué parámetro de laboratorio refleja la concentración media de glucosa en sangre de los últimos 2 a 3 meses?",
    options: [
      "Glucemia basal en ayunas",
      "Hemoglobina glicada (HbA1c)",
      "Insulinemia basal",
      "Cetonuria"
    ],
    correctIndex: 1,
    explanation: "Dado que la unión glucosa-hemoglobina es lenta e irreversible, la proporción de HbA1c correlaciona fielmente con la glucemia a lo largo de la vida del hematíe."
  },

  // --- Bloque 5: Genética Molecular y Microbiología ---
  {
    id: "q17",
    category: "Biología Molecular",
    question: "En una reacción de PCR convencional, ¿cuántas copias de ADN se pueden generar a partir de una única molécula tras 30 ciclos de amplificación?",
    options: [
      "60 copias",
      "3.000 copias",
      "Más de 1.000 millones de copias",
      "Exactamente 10.000 copias"
    ],
    correctIndex: 2,
    explanation: "El crecimiento exponencial sigue la fórmula $2^n$. Tras 30 ciclos se alcanzan $2^{30} \\approx 1.073.741.824$ copias exactas del fragmento diana."
  },
  {
    id: "q18",
    category: "Genética",
    question: "¿Qué porcentaje aproximado de la secuencia de ADN es idéntico entre dos seres humanos elegidos al azar?",
    options: [
      "Menos del 50%",
      "Alrededor del 75%",
      "Aproximadamente el 99,9%",
      "El 100% exacto"
    ],
    correctIndex: 2,
    explanation: "Toda la diversidad fenotípica y las variantes patológicas individuales radican en apenas un 0,1% del genoma humano."
  },
  {
    id: "q19",
    category: "Cribado Neonatal",
    question: "¿Qué nombre recibe el cribado que detecta precozmente decenas de metabolopatías congénitas en recién nacidos mediante sangre en papel secante?",
    options: [
      "Cariotipo espectral",
      "La prueba del talón",
      "Test de Coombs indirecto",
      "PCR multiplex fetal"
    ],
    correctIndex: 1,
    explanation: "La prueba del talón permite diagnosticar y tratar de forma inmediata enfermedades como el hipotiroidismo congénito antes de que se produzcan daños neurológicos irreversibles."
  },
  {
    id: "q20",
    category: "Microbiología",
    question: "¿Qué bacteria de origen entérico es la responsable de más del 75-80% de las infecciones urinarias diagnosticadas en urocultivo?",
    options: [
      "Streptococcus pyogenes",
      "Escherichia coli",
      "Mycobacterium tuberculosis",
      "Treponema pallidum"
    ],
    correctIndex: 1,
    explanation: "Las cepas uropatógenas de *Escherichia coli* colonizan por vía ascendente la uretra y vejiga urinaria con gran frecuencia."
  },

  // --- Bloque 6: Calidad, Seguridad y Práctica Profesional ---
  {
    id: "q21",
    category: "Calidad y Seguridad",
    question: "¿En qué etapa del proceso analítico se originan entre el 60% y el 70% de todos los errores de laboratorio?",
    options: [
      "En el cálculo informático de algoritmos",
      "En la fase preanalítica (identificación, preparación del paciente o conservación)",
      "Por reactivos químicos vencidos",
      "Por calibraciones defectuosas en el fotómetro"
    ],
    correctIndex: 1,
    explanation: "Errores de identificación, tubos inadecuados, falta de ayuno, hemólisis durante la extracción o demoras de transporte concentran la mayor parte de las incidencias."
  },
  {
    id: "q22",
    category: "Bioseguridad",
    question: "¿Por qué las salas de contención biológica de nivel 3 o 4 (BSL-3/4) operan con presión diferencial negativa?",
    options: [
      "Para refrigerar los equipos de frío",
      "Para garantizar que el flujo de aire sea hacia el interior si se abre una puerta y evitar fugas",
      "Para reducir la concentración de oxígeno",
      "Para atenuar ruidos y vibraciones"
    ],
    correctIndex: 1,
    explanation: "La presión negativa impide la salida de bioaerosoles potencialmente patógenos al exterior del recinto controlado."
  },
  {
    id: "q23",
    category: "Práctica Profesional",
    question: "¿Cuál de estos sectores NO forma parte de las salidas profesionales habituales del Técnico Superior en Laboratorio Clínico y Biomédico?",
    options: [
      "Laboratorios de hospitales de la red pública y privada",
      "Centros de reproducción asistida y bancos de tejidos",
      "Prescripción farmacológica y diagnóstico clínico médico independiente",
      "Laboratorios forenses y centros de investigación biomédica"
    ],
    correctIndex: 2,
    explanation: "El técnico superior procesa, analiza y valida las fases técnicas del análisis de muestras biológicas, siendo la prescripción médica y el diagnóstico final competencia facultativa."
  },
  // --- Bloque: Genética, Biología Molecular y Biotecnología ---
  {
    id: "q24",
    category: "Biología Molecular",
    question: "¿De qué organismo se aisló la enzima Taq polimerasa, fundamental para que la PCR resista temperaturas cercanas a 95 ºC sin destruirse?",
    options: [
      "Del veneno de víbora",
      "De una bacteria termófila de aguas termales (Thermus aquaticus)",
      "De células hepáticas de mamífero",
      "De levaduras fermentadoras de cerveza"
    ],
    correctIndex: 1,
    explanation: "La bacteria Thermus aquaticus vive de forma natural en manantiales hipertermales a más de 70 ºC, por lo que sus enzimas son termoestables y soportan los ciclos de desnaturalización térmica."
  },
  {
    id: "q25",
    category: "Genómica y Evolución Tecnológica",
    question: "¿Cuánto costó secuenciar el primer genoma humano completo frente al coste habitual que tiene hoy en día con NGS?",
    options: [
      "Costó 100.000 € y hoy cuesta unos 50.000 €",
      "Costó cerca de 3.000 millones de dólares y hoy se hace por unos pocos cientos de euros",
      "Siempre ha tenido un coste estándar de 5.000 €",
      "Costó 1 millón de euros y hoy es gratuito en todas las farmacias"
    ],
    correctIndex: 1,
    explanation: "El Proyecto Genoma Humano tardó más de una década y costó unos 3.000 millones de dólares; gracias a la secuenciación masiva (NGS), hoy se secuencia por menos de 500 € en pocas horas."
  },
  {
    id: "q26",
    category: "Citogenética",
    question: "¿Qué técnica citogenética clásica permite visualizar y ordenar al microscopio los 23 pares de cromosomas para detectar anomalías como la trisomía 21?",
    options: [
      "Citometría de flujo acústica",
      "Cariotipo convencional con bandeo cromosómico",
      "Western blot desnaturalizante",
      "Inmunofluorescencia indirecta"
    ],
    correctIndex: 1,
    explanation: "El cariotipo detiene las células en metafase mitótica mediante colchicina, permitiendo teñir y emparejar los cromosomas según su tamaño, posición del centrómero y patrón de bandas."
  },
  {
    id: "q27",
    category: "Genética Forense",
    question: "¿Qué técnica de electroforesis en gel se emplea habitualmente en el laboratorio para separar fragmentos de ADN según su tamaño molecular?",
    options: [
      "Cromatografía de gases acoplada a masas",
      "Electroforesis en gel de agarosa o poliacrilamida",
      "Espectrofotometría ultravioleta directa",
      "Liofilización al vacío"
    ],
    correctIndex: 1,
    explanation: "Al aplicar una corriente eléctrica en una matriz porosa de agarosa, las moléculas de ADN (con carga neta negativa por sus fosfatos) migran hacia el polo positivo a diferente velocidad según su tamaño."
  },

  // --- Bloque: Microbiología, Parasitología e Infecciosas ---
  {
    id: "q28",
    category: "Microbioma Humano",
    question: "¿Qué proporción aproximada representan los microorganismos simbióticos (microbiota) respecto a las células humanas en nuestro organismo?",
    options: [
      "Menos del 1%",
      "Alrededor del 10%",
      "Aproximadamente el 50% (en una proporción cercana al 1:1)",
      "Más del 99%"
    ],
    correctIndex: 2,
    explanation: "Investigaciones recientes estiman que un adulto alberga unos 30 billones de células humanas y aproximadamente 38 billones de bacterias, coexistiendo en un equilibrio metabólico e inmunitario clave."
  },
  {
    id: "q29",
    category: "Historia de la Microbiología",
    question: "¿Qué científico escocés descubrió fortuitamente la penicilina al notar que un hongo inhibía el crecimiento de bacterias en una placa de cultivo?",
    options: [
      "Louis Pasteur",
      "Alexander Fleming",
      "Robert Koch",
      "Santiago Ramón y Cajal"
    ],
    correctIndex: 1,
    explanation: "En 1928, Fleming observó que las colonias de Staphylococcus aureus situadas alrededor de una contaminación accidental con el moho Penicillium notatum se lisaban y morían."
  },
  {
    id: "q30",
    category: "Microbiología Clínica",
    question: "¿Por qué el conocido medio de cultivo 'agar chocolate' recibe ese nombre en el laboratorio microbiológico?",
    options: [
      "Porque contiene extracto de cacao como fuente de carbono",
      "Porque lleva sangre animal calentada que lisis los eritrocitos y le da color marrón",
      "Porque exhala un olor dulce idéntico al chocolate al incubarse",
      "Porque fue desarrollado originalmente por una empresa chocolatera suiza"
    ],
    correctIndex: 1,
    explanation: "Al calentar la sangre a unos 80 ºC, los glóbulos rojos se rompen liberando hemoglobina y factores de crecimiento (factor X o hemina y factor V o NAD), adoptando un tono pardo achocolatado."
  },
  {
    id: "q31",
    category: "Parasitología y Serología",
    question: "¿Qué parásito intracelular transmitido comúnmente por carne cruda o heces de felinos se monitoriza por anticuerpos en mujeres embarazadas?",
    options: [
      "Ascaris lumbricoides",
      "Toxoplasma gondii",
      "Giardia lamblia",
      "Enterobius vermicularis"
    ],
    correctIndex: 1,
    explanation: "El cribado serológico de anticuerpos IgG e IgM contra Toxoplasma gondii detecta si la gestante es inmune o si cursa una infección aguda con riesgo de secuelas neurológicas congénitas en el feto."
  },
  {
    id: "q32",
    category: "Medios de Cultivo",
    question: "¿Qué medio de cultivo selectivo y diferencial vira a color rosa intenso cuando la bacteria aislada es capaz de fermentar la lactosa?",
    options: [
      "Agar MacConkey",
      "Agar Sabouraud con cloranfenicol",
      "Agar Mueller-Hinton",
      "Agar sangre ovina"
    ],
    correctIndex: 0,
    explanation: "El agar MacConkey inhibe las bacterias Gram positivas mediante sales biliares y cristal violeta; las enterobacterias fermentadoras de lactosa generan ácido, virando el indicador rojo neutro a fucsia."
  },
  {
    id: "q33",
    category: "Micobacterias",
    question: "¿Cuánto tiempo de incubación puede requerir el cultivo diagnóstico de Mycobacterium tuberculosis debido a su lenta velocidad de división celular?",
    options: [
      "Menos de 15 minutos",
      "De 2 a 6 semanas",
      "Exactamente 24 horas",
      "Más de dos años ininterrumpidos"
    ],
    correctIndex: 1,
    explanation: "La rica capa de ácidos micólicos de su envoltura ralentiza el paso de nutrientes, provocando que M. tuberculosis tenga un tiempo de duplicación de 18-24 horas (frente a los 20 minutos de E. coli)."
  },

  // --- Bloque: Bioquímica Clínica y Fisiopatología ---
  {
    id: "q34",
    category: "Función Renal",
    question: "¿Cuál es el metabolito endógeno muscular medido en suero y orina para calcular la tasa de filtrado glomerular en los riñones?",
    options: [
      "Glucógeno hepático",
      "Creatinina",
      "Bilirrubina indirecta",
      "Ácido láctico"
    ],
    correctIndex: 1,
    explanation: "La creatinina se produce a un ritmo constante en la masa muscular y los glomérulos la filtran casi sin reabsorberla, convirtiéndola en el biomarcador estándar de filtración renal."
  },
  {
    id: "q35",
    category: "Interferencias Analíticas",
    question: "¿A qué se debe el aspecto lechoso u opaco (lipemia) que a veces presenta el suero o plasma en el laboratorio?",
    options: [
      "A una concentración desproporcionada de glóbulos blancos",
      "A una hipertrigliceridemia marcada por quilomicrones o VLDL",
      "A haber bebido leche entera justo antes del pinchazo",
      "A una falta total de hierro en circulación"
    ],
    correctIndex: 1,
    explanation: "La presencia de grandes lipoproteínas (quilomicrones tras ingestas ricas en grasas o dislipemias) dispersa la luz y enturbia la muestra, interfiriendo en las lecturas fotométricas del analizador."
  },
  {
    id: "q36",
    category: "Líquidos Biológicos",
    question: "¿Qué líquido biológico claro se extrae por punción lumbar entre las vértebras L3-L5 para analizar sospechas de meningitis o esclerosis múltiple?",
    options: [
      "Líquido sinovial articular",
      "Líquido cefalorraquídeo (LCR)",
      "Líquido peritoneal ascítico",
      "Líquido pericárdico"
    ],
    correctIndex: 1,
    explanation: "El LCR circula por el espacio subaracnoideo; su estudio citoquímico urgente (proteínas, glucosa y recuento celular en cámara de Neubauer) diferencia meningitis bacterianas de víricas."
  },
  {
    id: "q37",
    category: "Proteínas Plasmáticas",
    question: "¿Cuál es la proteína más abundante del plasma humano, sintetizada por el hígado y responsable de la mayor parte de la presión oncótica intravascular?",
    options: [
      "Fibrinógeno",
      "Albúmina",
      "Inmunoglobulina E",
      "Ferritina"
    ],
    correctIndex: 1,
    explanation: "La albúmina constituye entre el 55% y el 65% de las proteínas plasmáticas totales, transporta fármacos y hormonas, y retiene el agua dentro del lecho vascular para evitar edemas."
  },
  {
    id: "q38",
    category: "Metabolismo",
    question: "¿Qué pigmento biliar de color amarillento-naranja se acumula en sangre y tiñe piel y mucosas (ictericia) cuando hay hemólisis masiva u obstrucción biliar?",
    options: [
      "Melanina",
      "Bilirrubina",
      "Hemoglobina libre",
      "Mioglobina"
    ],
    correctIndex: 1,
    explanation: "La bilirrubina es el producto final de la degradación del grupo hemo de los glóbulos rojos; su elevación en suero (fracción directa o indirecta) orienta patologías hepáticas y hemolíticas."
  },

  // --- Bloque: Hematología, Inmunohematología y Transfusión ---
  {
    id: "q39",
    category: "Inmunohematología",
    question: "¿Por qué es obligatorio realizar pruebas cruzadas (crossmatch) in vitro antes de transfundir un concentrado de hematíes a un paciente?",
    options: [
      "Para comprobar si el donante y receptor tienen la misma presión arterial",
      "Para confirmar que el suero del receptor no tiene anticuerpos que lisen los glóbulos rojos del donante",
      "Para calcular las calorías y nutrientes de la bolsa sanguínea",
      "Para descartar si el receptor tiene alergia al plástico de la bolsa"
    ],
    correctIndex: 1,
    explanation: "Enfrentar el suero del receptor con los hematíes del donante previene reacciones hemolíticas transfusionales graves e incompatibilidades de grupos sanguíneos menores."
  },
  {
    id: "q40",
    category: "Hematopoyesis",
    question: "¿Qué gran célula polipoide de la médula ósea emite prolongaciones citoplasmáticas que se fragmentan para formar las plaquetas sanguíneas?",
    options: [
      "Macrófago alveolar",
      "Megacariocito",
      "Osteoclasto remodelador",
      "Eritroblasto policromatófilo"
    ],
    correctIndex: 1,
    explanation: "Un único megacariocito maduro extiende proplaquetas por los sinusoides vasculares medulares que se escinden mecánicamente, liberando de 1.000 a 3.000 plaquetas anucleadas."
  },
  {
    id: "q41",
    category: "Hematología",
    question: "Si centrifugas sangre total con anticoagulante, ¿en qué orden estricto de densidades se separan sus componentes de abajo hacia arriba?",
    options: [
      "Glóbulos blancos abajo, plasma en medio y hematíes arriba",
      "Hematíes en el fondo, capa leucoplaquetaria (buffy coat) en medio y plasma en la parte superior",
      "Plasma en el fondo, hematíes en medio y plaquetas arriba",
      "No se separan porque el anticoagulante neutraliza la densidad de las células"
    ],
    correctIndex: 1,
    explanation: "Los hematíes (los más densos) van al fondo (\~45%), seguidos de la estrecha franja leucoplaquetaria blanca (\~1%) y el sobrenadante transparente del plasma (\~54%)."
  },
  {
    id: "q42",
    category: "Técnicas Microscópicas",
    question: "¿Qué mezcla tintórea tradicional (colorantes tipo Romanowsky) se emplea para teñir frotis sanguíneos y ver al microscopio neutrófilos, linfocitos y plaquetas?",
    options: [
      "Tinta china diluida",
      "Tinción de Wright o Giemsa",
      "Yodo Lugol concentrado",
      "Rojo congo puro"
    ],
    correctIndex: 1,
    explanation: "La combinación de azul de metileno (básico) y eosina (ácido) tiñe de púrpura el ADN nuclear, de rosa el citoplasma eritrocitario y revela los gránulos característicos de los leucocitos."
  },

  // --- Bloque: Ciencia Forense, Instrumentación y Buenas Prácticas ---
  {
    id: "q43",
    category: "Genética y Química Forense",
    question: "¿Qué compuesto químico luminiscente emplean los laboratorios forenses para revelar trazas invisibles de sangre en superficies lavadas?",
    options: [
      "Formaldehído",
      "Luminol",
      "Permanganato de potasio",
      "Acetona pura"
    ],
    correctIndex: 1,
    explanation: "El luminol, en presencia de un oxidante, es catalizado por el hierro de la hemoglobina oxidada produciendo una quimioluminiscencia azulada visible en la oscuridad."
  },
  {
    id: "q44",
    category: "Instrumentación",
    question: "¿Qué instrumento manual de pistón es el estándar diario del técnico de laboratorio para dosificar líquidos con precisión de microlitros (µL)?",
    options: [
      "Pipeta de plástico Pasteur",
      "Micropipeta automática de volumen variable",
      "Bureta volumétrica de vidrio con llave",
      "Matraz aforado con tapón de teflón"
    ],
    correctIndex: 1,
    explanation: "Las micropipetas automáticas (calibradas para rangos de 0,2 a 10 µL, 20 a 200 µL o 100 a 1.000 µL) permiten pipetear alícuotas microscópicas de reactivos y enzimas con alta reproducibilidad."
  },
  {
    id: "q45",
    category: "Bioseguridad",
    question: "¿Qué cabina de protección colectiva es obligatoria en microbiología clínica para proteger simultáneamente la muestra del operador y al operador del agente infeccioso?",
    options: [
      "Campana extractora de gases químicos convencional",
      "Cabina de seguridad biológica de clase II con flujo laminar vertical y filtros HEPA",
      "Cabina de flujo laminar horizontal simple",
      "Cámara deshumidificadora estanca"
    ],
    correctIndex: 1,
    explanation: "Las cabinas de clase II combinan una cortina de aire frontal para proteger al profesional con un flujo estéril recirculado mediante filtros HEPA que esteriliza el área de trabajo."
  },
  {
    id: "q46",
    category: "Logística y Red Sanitaria",
    question: "¿Cómo viajan las muestras de sangre y fluidos tomadas en los consultorios de atención primaria hasta el laboratorio central hospitalario de su área?",
    options: [
      "Por correo postal ordinario sin refrigerar",
      "En neveras isotérmicas homologadas de transporte biológico (sistema de triple embalaje)",
      "Congeladas siempre con nitrógeno líquido a -196 ºC",
      "No viajan: cada ambulatorio cuenta con un laboratorio robotizado propio"
    ],
    correctIndex: 1,
    explanation: "La normativa UN 3373 exige cajas isotérmicas con triple capa (tubo primario estanco, contenedor secundario absorbente y embalaje exterior rígido) para garantizar la integridad y bioseguridad del circuito."
  },
  {
    id: "q47",
    category: "Hematología Especial",
    question: "¿Qué recuento analítico permite evaluar en menos de 24 horas si la médula ósea está respondiendo adecuadamente y produciendo hematíes nuevos tras una anemia?",
    options: [
      "Recuento de plaquetas basales",
      "Recuento de reticulocitos (glóbulos rojos inmaduros)",
      "Dosificación de ácido úrico",
      "Nivel de colesterol LDL"
    ],
    correctIndex: 1,
    explanation: "Los reticulocitos conservan restos de ARN ribosomal y circulan 1 o 2 días antes de madurar; su aumento confirma que la médula ósea es regenerativa ante una pérdida hemática."
  },
  {
    id: "q48",
    category: "Automatización",
    question: "¿Qué función primordial desempeñan los lectores ópticos de códigos de barras o chips RFID en los tubos del laboratorio hospitalario moderno?",
    options: [
      "Cobrar el coste de los análisis a la salida",
      "Garantizar la trazabilidad unívoca paciente-muestra e instruir a las máquinas sobre qué pruebas realizar",
      "Medir el volumen de líquido dentro del tubo mediante infrarrojos",
      "Evitar que el tubo pueda abrirse accidentalmente"
    ],
    correctIndex: 1,
    explanation: "El código de barras vincula la muestra al Sistema de Información del Laboratorio (SIL/LIS), eliminando fallos de transcripción y permitiendo que los robots ejecuten el perfil solicitado automáticamente."
  },
  {
    id: "q49",
    category: "Inmunología Clínica",
    question: "¿Qué técnica de inmunoensayo en placa de microtitulación (frecuentemente leída por absorbancia a 450 nm) es básica para cuantificar hormonas, virus y alérgenos?",
    options: [
      "ELISA (Enzyme-Linked Immunosorbent Assay)",
      "Gasometría arterial de electrodo seco",
      "Sedimentación globular de Westergren",
      "Tinción de Gram al calor"
    ],
    correctIndex: 0,
    explanation: "El método ELISA aprovecha la especificidad antígeno-anticuerpo junto con una enzima que cataliza un cambio de color proporcional a la concentración del analito investigado."
  },
  {
    id: "q50",
    category: "Orientación Vocacional FP",
    question: "¿Qué rasgo caracteriza principalmente el plan de estudios del Ciclo Formativo de Grado Superior en Laboratorio Clínico y Biomédico?",
    options: [
      "El 100% de la formación es teórica sin contacto con instrumental ni reactivos",
      "Un elevado peso de prácticas de laboratorio con tecnología real complementado con Formación en Centros de Trabajo (FCT/Dual) en hospitales y clínicas",
      "Está limitado exclusivamente a clasificar carpetas administrativas sanitarias",
      "Solo habilita para trabajar en laboratorios de cosmética capilar"
    ],
    correctIndex: 1,
    explanation: "El ciclo destaca por su carácter eminentemente práctico, capacitando al alumnado en micropipeteo, hematología, microbiología, genética y analizadores clínicos reales en conexión con el entorno sanitario."
  }
];