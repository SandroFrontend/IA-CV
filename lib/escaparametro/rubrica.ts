import type { RubricItemDef } from "@/lib/types";

export const RUBRIC_ITEMS =
    [
        {
            id: "coherencia_concepto",
            name: "Coherencia conceptual y adecuación al texto descriptivo",
            description:
                "¿Se alinea la composición visual del escaparate con la temática, valores de marca o narrativa explicada en el texto descriptivo?",
            levels: [
                { score: 0, label: "Discrepancia total entre la imagen y la memoria descriptiva; no existe hilo conductor ni temática reconocible" },
                { score: 1, label: "Relación muy débil o forzada entre el texto y la imagen; la temática apenas se intuye visualmente" },
                { score: 2, label: "Refleja parcialmente el concepto descrito, pero faltan elementos clave o el mensaje resulta confuso para el transeúnte" },
                { score: 3, label: "Buena correspondencia entre el texto y el escaparate; el concepto se transmite con claridad y orden visual" },
                { score: 4, label: "Integración conceptual impecable; la imagen plasma con exactitud y potencia creativa el relato y los objetivos descritos" },
            ],
        },
        {
            id: "composicion_visual",
            name: "Composición espacial, equilibrio y punto focal",
            description:
                "¿Aplica principios de escaparatismo como líneas de fuga, distribución de pesos, ritmo, jerarquía visual y un punto focal bien definido?",
            levels: [
                { score: 0, label: "Caos visual absoluto, acumulación sin criterio o espacio vacío sin estructura compositiva" },
                { score: 1, label: "Distribución descompensada, sin punto focal claro; elementos dispersos que dispersan la mirada" },
                { score: 2, label: "Estructura básica visible (simetría simple o pirámide), pero con saturación o desequilibrio en pesos y alturas" },
                { score: 3, label: "Composición equilibrada con punto focal definido, uso adecuado de zonas frías/calientes y niveles visuales correctos" },
                { score: 4, label: "Composición magistral: dinamismo, ritmo y pesos visuales óptimos que guían la mirada de forma natural e impactante" },
            ],
        },
        {
            id: "iluminacion_color",
            name: "Iluminación, paleta cromática y atmósfera",
            description:
                "¿El esquema de color y el tratamiento de la luz (focal, ambiental, sombras, reflejos) realzan el producto y generan el clima deseado?",
            levels: [
                { score: 0, label: "Iluminación deficiente (zonas oscuras o deslumbramientos) y mezcla cromática disonante o descuidada" },
                { score: 1, label: "Uso plano de la luz sin destacar productos; paleta de color monótona o con contrastes que restan legibilidad" },
                { score: 2, label: "Iluminación general aceptable aunque sin direccionalidad estratégica; combinación de colores correcta pero poco expresiva" },
                { score: 3, label: "Luz dirigida eficazmente a los elementos clave, control de reflejos y armonía cromática coherente con la escena" },
                { score: 4, label: "Diseño lumínico y cromático sobresaliente: crea volumen, dramatismo o calidez óptima, potenciando texturas y producto" },
            ],
        },
        {
            id: "producto_llamada_accion",
            name: "Protagonismo del producto, cartelería y capacidad de atracción",
            description:
                "¿El producto es el protagonista indiscutible, la cartelería/precios están bien integrados y el conjunto invita a detenerse y entrar a la tienda?",
            levels: [
                { score: 0, label: "El producto queda oculto o eclipsado por el atrezo; no genera interés ni comunica valor comercial" },
                { score: 1, label: "El atrezo compite con el producto; elementos gráficos o tipográficos mal colocados o de difícil lectura" },
                { score: 2, label: "El producto se identifica pero carece de realce comercial; cartelería legible aunque integrada de forma básica" },
                { score: 3, label: "Producto bien jerarquizado y visible; elementos gráficos nítidos y atractivo comercial suficiente para captar atención" },
                { score: 4, label: "Impacto comercial máximo: producto perfectamente ensalzado, llamada a la acción irresistible y ejecución técnica pulcra" },
            ],
        },
    ];
