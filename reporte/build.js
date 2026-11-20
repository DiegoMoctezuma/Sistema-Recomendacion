// Genera el reporte final de Datos Masivos II en Word.
// Uso (desde reporte/): node build.js paginas.json
// Requiere el paquete npm "docx". Lee export/resultados.json, web/demo.json y figs/.
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, TabStopType, HeadingLevel, VerticalAlign,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType,
} = require("docx");

const REPO = path.resolve(__dirname, "..");
const R = JSON.parse(fs.readFileSync(path.join(REPO, "export/resultados.json"), "utf8"));
const DEMO = JSON.parse(fs.readFileSync(path.join(REPO, "web/demo.json"), "utf8"));
const PAGINAS = process.argv[2] && fs.existsSync(process.argv[2])
  ? JSON.parse(fs.readFileSync(process.argv[2], "utf8")) : {};

// ---------- formato numérico (es-MX: coma de miles, punto decimal) ----------
const miles = (x) => Math.round(x).toLocaleString("en-US");
const d = (x, n = 2) => Number(x).toLocaleString("en-US", { minimumFractionDigits: n, maximumFractionDigits: n });
const pct = (x, n = 2) => `${d(x, n)}%`;
const modelo = (nombre, tabla = R.tabla_modelos) => tabla.find((m) => m.modelo === nombre);
const cmp = (b) => R.incertidumbre.comparaciones.find((c) => c.b === b);
const ic = (c) => `[${d(c.ci95_pp[0])}, ${d(c.ci95_pp[1])}]`;

// ---------- estilo ----------
const NEGRO = "000000", GRIS = "7F7F7F", GRIS_CLARO = "F2F2F2", BORDE = "BFBFBF", ENCABEZADO = "D9D9D9";
const ROJO = NEGRO, AZUL = NEGRO;
const FUENTE = "Arial";
const ANCHO = 9026; // A4 (11906) menos márgenes de 1440

const INTEGRANTES = ["Moctezuma Ramírez Diego Rafael", "Mera Montiel Gonzalo Sebastián"];
const ESTUDIANTE = "Diego Rafael Moctezuma Ramírez y Gonzalo Sebastián Mera Montiel";
const TITULO_CORTO = "A domicilio · Motor de recomendación";

// Texto con **negritas** y *cursivas* simples.
function runs(texto, base = {}) {
  const partes = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let ultimo = 0, m;
  while ((m = re.exec(texto))) {
    if (m.index > ultimo) partes.push(new TextRun({ text: texto.slice(ultimo, m.index), ...base }));
    const t = m[0];
    if (t.startsWith("**")) partes.push(new TextRun({ text: t.slice(2, -2).replace(/`/g, ""), bold: true, ...base }));
    else if (t.startsWith("`")) partes.push(new TextRun({ text: t.slice(1, -1), font: "Consolas", size: 19, ...base }));
    else partes.push(new TextRun({ text: t.slice(1, -1), italics: true, ...base }));
    ultimo = m.index + t.length;
  }
  if (ultimo < texto.length) partes.push(new TextRun({ text: texto.slice(ultimo), ...base }));
  return partes;
}
const P = (texto, opts = {}) => new Paragraph({
  children: runs(texto), alignment: AlignmentType.JUSTIFIED, spacing: { after: 160, line: 276 }, ...opts,
});
const H1 = (texto) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(texto)] });
const H2 = (texto) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(texto)] });
const H3 = (texto) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(texto)] });
const Bullet = (texto) => new Paragraph({
  numbering: { reference: "viñetas", level: 0 }, children: runs(texto),
  alignment: AlignmentType.JUSTIFIED, spacing: { after: 60, line: 264 },
});
const Nota = (texto) => {
  const esTabla = /^Tabla /.test(texto);
  const esFigura = /^Figura /.test(texto);
  const p = new Paragraph({
    children: runs(texto, { italics: true, color: GRIS, size: 16 }),
    alignment: esFigura ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: esTabla ? { before: 200, after: 80 } : { before: 60, after: 200 }, keepNext: esTabla,
  });
  p._esTabla = esTabla;
  return p;
};
// Los títulos de tabla van arriba, como los de código en el diseño de referencia.
function reordenar(arr) {
  const out = [...arr];
  for (let i = 0; i < out.length - 1; i++) {
    if (out[i] instanceof Table && out[i + 1] && out[i + 1]._esTabla) {
      [out[i], out[i + 1]] = [out[i + 1], out[i]];
      out.splice(i + 2, 0, new Paragraph({ spacing: { after: 120 }, children: [] }));
      i += 2;
    }
  }
  return out;
}
const Salto = () => new Paragraph({ children: [new PageBreak()] });

function celda(texto, ancho, { encabezado = false, sombra = null, negrita = false, color = null, alinear = AlignmentType.LEFT, junto = false } = {}) {
  const borde = { style: BorderStyle.SINGLE, size: 4, color: BORDE };
  return new TableCell({
    width: { size: ancho, type: WidthType.DXA },
    borders: { top: borde, bottom: borde, left: borde, right: borde },
    shading: encabezado ? { fill: ENCABEZADO, type: ShadingType.CLEAR, color: "auto" }
      : sombra ? { fill: sombra, type: ShadingType.CLEAR, color: "auto" } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: alinear, keepNext: junto,
      children: runs(String(texto), {
        size: 18, bold: encabezado || negrita,
      }),
    })],
  });
}
function Tabla(encabezados, filas, anchos, { resaltar = () => false, numericas = [] } = {}) {
  const total = anchos.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: anchos,
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: encabezados.map((h, i) => celda(h, anchos[i], { encabezado: true, junto: true })) }),
      ...filas.map((fila, k) => new TableRow({
        cantSplit: true,
        children: fila.map((v, i) => celda(v, anchos[i], {
          junto: true,
          sombra: null,
          negrita: resaltar(fila, k), color: resaltar(fila, k) ? ROJO : null,
          alinear: numericas.includes(i) ? AlignmentType.RIGHT : AlignmentType.LEFT,
        })),
      })),
    ],
  });
}
function Figura(archivo, pie, ancho = 560) {
  const buf = fs.readFileSync(archivo);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 }, keepNext: true,
      children: [new ImageRun({ type: "png", data: buf, transformation: { width: ancho, height: Math.round(ancho * h / w) },
        altText: { title: pie, description: pie, name: path.basename(archivo) } })],
    }),
    Nota(pie),
  ];
}
let nCodigo = 0;
function Codigo(titulo, temario, explicacion, lineas) {
  nCodigo += 1;
  const out = [H3(titulo)];
  out.push(P(explicacion, { keepNext: true }));
  out.push(new Paragraph({ keepNext: true, spacing: { before: 80, after: 60 },
    children: [new TextRun({ text: `Código A.${nCodigo}. ${temario}.`, italics: true, color: GRIS, size: 16 })] }));
  const b = { style: BorderStyle.SINGLE, size: 4, color: BORDE, space: 6 };
  lineas.forEach((l, i) => out.push(new Paragraph({
    shading: { fill: GRIS_CLARO, type: ShadingType.CLEAR, color: "auto" },
    border: { left: b, right: b, ...(i === 0 ? { top: b } : {}), ...(i === lineas.length - 1 ? { bottom: b } : {}) },
    spacing: { after: 0, line: 240 }, indent: { left: 140, right: 140 }, keepNext: i < lineas.length - 1, keepLines: true,
    children: [new TextRun({ text: l === "" ? " " : l, font: "Consolas", size: 16 })],
  })));
  out.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
  return out;
}

// ---------- cifras ----------
const PPR = modelo("Caminata aleatoria (PPR)");
const SIEMPRE = modelo("Lo de siempre");
const ALS = modelo("ALS (factores latentes)");
const W75 = modelo("Híbrido fijo (w=0.75)");
const POPREC = modelo("Popularidad reciente (14 días)");
const POP = modelo("Popularidad");
const pprVal = modelo("Caminata aleatoria (PPR)", R.tabla_validacion);
const seg = (s, m) => R.segmentos_restaurantes.find((x) => x.segmento === s && x.modelo === m);
const frio = seg("1–50 pedidos previos", "Caminata aleatoria (PPR)");
const ceroCont = seg("0 pedidos previos", "Contenido");
const cSiempre = cmp("Lo de siempre"), cW75 = cmp("Híbrido fijo (w=0.75)"), cALS = cmp("ALS (factores latentes)");
const anexo = R.anexo_hibrido_calibrado;
const calTest = anexo.test.metricas;
const clfTest = R.clasificador.test.calibrado;
const nuevosMax = [...R.tabla_modelos].sort((a, b) => b["recall nuevos"] - a["recall nuevos"])[0];
const sinHist = R.usuarios_nuevos.metricas;
const arq = DEMO.arquetipos;
const tasaRepTotal = R.tasa_repeticion_total;

// ---------- portada ----------
const img = (f) => fs.readFileSync(path.join(__dirname, "assets", f));
const EMU = 12700; // por punto
const flotante = (archivo, x, y, w, h) => new ImageRun({
  type: "png", data: img(archivo), transformation: { width: Math.round(w * 4 / 3), height: Math.round(h * 4 / 3) },
  floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: Math.round(x * EMU) },
    verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round(y * EMU) },
    wrap: { type: TextWrappingType.NONE }, behindDocument: true, allowOverlap: true },
  altText: { title: archivo, description: archivo, name: archivo },
});
const linea = (texto, { negrita = false, antes = 0, despues = 0 } = {}) => new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { before: antes, after: despues },
  children: [new TextRun({ text: texto, bold: negrita, size: 24 })],
});
const portada = [
  new Paragraph({ children: [
    flotante("unam.png", 74, 98, 114, 128),
    flotante("fes.png", 436, 92, 118, 118),
    flotante("lineas.png", 62, 286, 30, 504),
  ] }),
  linea("UNIVERSIDAD NACIONAL AUTÓNOMA DE MÉXICO", { negrita: true, antes: 3900, despues: 620 }),
  linea("FACULTAD DE ESTUDIOS SUPERIORES ACATLÁN", { negrita: true, despues: 620 }),
  linea("DATOS MASIVOS II", { negrita: true, despues: 620 }),
  linea("ALUMNOS:", { negrita: true }),
  ...INTEGRANTES.map((n) => linea(n.toUpperCase())),
  linea("PROFESORA:", { negrita: true, antes: 1100 }),
  linea("ALONDRA VANIANINETL BERZUNZA RODRÍGUEZ", { despues: 480 }),
  linea("PROYECTO FINAL:", { negrita: true }),
  linea("A DOMICILIO: MOTOR DE RECOMENDACIÓN DE RESTAURANTES", {}),
  linea("CON ANÁLISIS DE VÍNCULOS", { despues: 480 }),
  linea("FECHA:", { negrita: true }),
  linea("19/11/26"),
  Salto(),
];

// ---------- índice ----------
const ENTRADAS = [
  ["1. Objetivo", 0], ["2. Marco Teórico", 0],
  ["2.1 Reducción de la dimensionalidad (Unidad 1)", 1], ["2.2 Minería de elementos frecuentes (Unidad 2)", 1],
  ["2.3 Análisis de vínculos (Unidad 3)", 1], ["2.4 Sistemas de recomendación (Unidad 4)", 1],
  ["2.5 Análisis de grafos de redes sociales (Unidad 5)", 1], ["2.6 Recomendación en pedidos a domicilio", 1],
  ["3. Hipótesis", 0], ["4. Desarrollo (Metodología)", 0], ["5. Resultados", 0],
  ["5.1 Demanda y repetición", 1], ["5.2 Elementos frecuentes y secuencias", 1], ["5.3 Vínculos y comunidades", 1],
  ["5.4 Comparación de recomendadores", 1], ["5.5 Poca historia, sin historial y descubrimiento", 1],
  ["5.6 Factores latentes y demo", 1],
  ["6. Conclusiones", 0], ["7. Referencias", 0], ["Anexo A — Código clave", 0], ["Anexo B — Experimento negativo: híbrido calibrado", 0],
];
const indice = [
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Índice")], outlineLevel: undefined }),
  ...ENTRADAS.map(([t, nivel]) => new Paragraph({
    indent: { left: nivel ? 360 : 0 }, spacing: { after: nivel ? 60 : 100 },
    tabStops: [{ type: TabStopType.RIGHT, position: ANCHO, leader: "dot" }],
    children: [new TextRun({ text: t, size: 21, bold: nivel === 0 }),
      ...(nivel === 0 ? [new TextRun({ text: `\t${PAGINAS[t] ?? ""}`, size: 21 })] : [])],
  })),
  Salto(),
];

// ---------- 1. Objetivo ----------
const objetivo = [
  H1("1. Objetivo"),
  H2("1.1 Objetivo general"),
  P("Construir y evaluar un motor de recomendación de restaurantes para pedidos a domicilio que aplique los métodos de **análisis de vínculos**, **minería de elementos frecuentes**, **reducción de dimensionalidad** y **sistemas de recomendación** vistos en Datos Masivos II, sobre más de cuatro millones de líneas de pedido reales, con el fin de determinar qué métodos recuperan mejor los restaurantes que cada cliente pide después y dónde están sus límites."),
  H2("1.2 Objetivos específicos"),
  Bullet("**O1.** Medir la concentración de la demanda, el ritmo semanal y la proporción de pedidos que vuelven a un restaurante ya conocido, respetando la separación temporal del conjunto de datos."),
  Bullet("**O2.** Encontrar asociaciones entre tipos de cocina (Apriori y FP-Growth), productos que viajan juntos en un pedido y secuencias de cocinas (PrefixSpan)."),
  Bullet("**O3.** Construir el grafo de restaurantes que comparten clientes y analizarlo con PageRank, HITS y detección de comunidades (Louvain)."),
  Bullet("**O4.** Comparar once recomendadores, de bases simples a caminatas aleatorias personalizadas y factores latentes, con un protocolo de validación temporal que elige el modelo antes de mirar la prueba final."),
  Bullet("**O5.** Medir por separado la recuperación de restaurantes conocidos y nuevos, el desempeño en restaurantes con poca historia y en clientes sin historial, y explicar cada recomendación de forma verificable."),
  Salto(),
];

// ---------- 2. Marco teórico ----------
const marco = [
  H1("2. Marco Teórico"),
  P("Este marco integra los temas del programa de Datos Masivos II que se implementaron en el proyecto. Para cada tema se resume su fundamento y su expresión concreta en el código (notebook `01_motor_recomendacion.ipynb`)."),
  H2("2.1 Reducción de la dimensionalidad (Unidad 1)"),
  H3("2.1.1 Método de potencias (tema 1.1)"),
  P("El método de potencias aproxima el vector propio dominante de una matriz *A* iterando *x(k+1) = A·x(k) / ‖A·x(k)‖* hasta que el cambio entre iteraciones es menor que una tolerancia. Converge cuando el valor propio dominante está separado del segundo, y solo requiere multiplicar matriz por vector, lo que lo hace adecuado para matrices dispersas enormes (Leskovec, Rajaraman y Ullman, 2020)."),
  P(`En el proyecto, PageRank y HITS se calculan con este método sobre matrices dispersas de SciPy: PageRank convergió en **${R.pagerank_iteraciones} iteraciones** con tolerancia L1 de 10⁻¹⁰, y HITS binario en ${R.hits_metadatos.binario.iteraciones} iteraciones con tolerancia de 10⁻⁸.`),
  H3("2.1.2 Descomposición en valores singulares (tema 1.2)"),
  P(`La SVD factoriza una matriz *M = U Σ Vᵀ*; truncarla a los *k* valores singulares más grandes da la mejor aproximación de rango *k* en norma de Frobenius. Aplicada a la matriz cliente × restaurante (${miles(R.usuarios_train)} × ${miles(R.vendors)}, con ${pct(R.densidad_matriz, 4)} de celdas ocupadas), cada cliente y cada restaurante quedan representados por ${R.als_factores} componentes, y el producto reconstruido sirve como puntaje de recomendación.`),
  H3("2.1.3 t-SNE (tema 1.5)"),
  P("t-SNE proyecta datos de alta dimensión a dos dimensiones preservando vecindades locales. Se usó para explorar los factores latentes de los 2,500 restaurantes más pedidos. Sus distancias globales no son interpretables, así que solo se usa como exploración visual, no como evidencia de desempeño."),
  H2("2.2 Minería de elementos frecuentes (Unidad 2)"),
  H3("2.2.1 Modelo mercado-canasta, Apriori y FP-Growth (temas 2.1, 2.2 y 2.5)"),
  P("En el modelo mercado-canasta cada canasta es un conjunto de ítems; un conjunto es frecuente si su soporte supera un umbral. Apriori explota la monotonía del soporte (todo subconjunto de un conjunto frecuente es frecuente) y genera candidatos nivel por nivel. FP-Growth comprime las canastas en un árbol de prefijos y extrae los conjuntos sin generar candidatos. Las reglas *A → B* se describen con soporte, confianza *P(B|A)* y lift *P(B|A)/P(B)*."),
  P(`Aquí cada canasta es el conjunto de cocinas que un cliente pidió en entrenamiento (${miles(R.canastas_n)} canastas, ${R.canastas_cocinas} cocinas). Ambos algoritmos se ejecutaron sobre los mismos datos y el notebook verifica que produzcan **exactamente los mismos ${R.itemsets_frecuentes} conjuntos** con los mismos soportes.`),
  H3("2.2.2 PrefixSpan (tema 2.6)"),
  P("PrefixSpan encuentra subsecuencias frecuentes proyectando la base de secuencias sobre cada prefijo frecuente y creciendo el patrón de forma recursiva. Se implementó desde cero sobre la secuencia temporal de cocinas de cada cliente."),
  H2("2.3 Análisis de vínculos (Unidad 3)"),
  H3("2.3.1 PageRank (tema 3.1)"),
  P("PageRank modela un caminante aleatorio que sigue aristas con probabilidad *d* y salta a un nodo al azar con probabilidad *1 − d*. Su vector estacionario es *r = d·P·r + (1 − d)/n*, donde *P* es la matriz de transición. La masa de los nodos sin aristas se redistribuye para conservar una distribución de probabilidad."),
  H3("2.3.2 HITS (tema 3.2)"),
  P("HITS asigna a cada nodo un puntaje de *hub* y otro de *autoridad* que se refuerzan mutuamente: *h = A·a* y *a = Aᵀ·h*. Son los vectores singulares dominantes de la matriz de adyacencia. Aquí se aplica a la matriz bipartita cliente → restaurante: los clientes son hubs y los restaurantes, autoridades."),
  H3("2.3.3 Caminatas aleatorias personalizadas (tema 3.4)"),
  P("La caminata aleatoria con reinicio (Personalized PageRank, PPR) reemplaza el salto uniforme por un salto al perfil del usuario *p₀*: *x = α·x·P + (1 − α)·p₀*. El resultado mide qué tan alcanzable es cada restaurante desde lo que el cliente ya pidió. Como la solución es lineal en *p₀*, el puntaje de un restaurante se descompone exactamente en la suma de aportes de cada restaurante del historial, propiedad que el demo usa para explicar cada recomendación."),
  H2("2.4 Sistemas de recomendación (Unidad 4)"),
  H3("2.4.1 Retroalimentación implícita y arranque en frío (tema 4.1)"),
  P("En pedidos a domicilio no hay calificaciones explícitas: la señal es implícita (pedir o no pedir). El arranque en frío aparece en dos formas distintas que se miden por separado: clientes sin pedidos previos y restaurantes con poca o ninguna historia."),
  H3("2.4.2 Contenido, filtrado colaborativo y factores latentes (temas 4.2 a 4.4)"),
  Bullet("**Basado en contenido:** perfil del cliente como promedio de los atributos de los restaurantes que pidió (cocina, zona y precio), comparado por coseno con todo el catálogo."),
  Bullet(`**Filtrado colaborativo ítem-ítem:** similitud coseno entre restaurantes según clientes compartidos, conservando los ${R.cf_vecinos} vecinos más similares de cada uno.`),
  Bullet(`**Factores latentes:** ALS para retroalimentación implícita (Hu, Koren y Volinsky, 2008) con ${R.als_factores} factores y SVD truncado.`),
  H3("2.4.3 Evaluación (tema 4.5)"),
  P("Se usan métricas de ranking en las diez primeras posiciones: precisión@10, recall@10 y NDCG@10, que también premia el orden. Para comparar dos modelos sobre los mismos clientes se usa bootstrap pareado: se remuestrean clientes con reemplazo y se obtiene un intervalo de confianza del 95% para la diferencia de NDCG."),
  H2("2.5 Análisis de grafos de redes sociales (Unidad 5)"),
  P("La detección de comunidades busca grupos de nodos más conectados entre sí que con el resto. El método de Louvain optimiza la modularidad *Q* de forma voraz en dos fases que se repiten: mueve nodos a la comunidad vecina que más aumenta *Q* y luego colapsa cada comunidad en un nodo. Se aplicó al grafo de restaurantes que comparten clientes."),
  H2("2.6 Recomendación en pedidos a domicilio"),
  P("A diferencia de películas o libros, en comida a domicilio repetir es normal: la gente vuelve a sus lugares de confianza. Una base que solo recomienda lo que el cliente ya pidió (“Lo de siempre”) es por ello un rival difícil. Además, la recomendación está limitada por la geografía: un restaurante solo es útil si reparte en la zona del cliente. El Delivery Hero Recommendation Dataset (Assylbekov et al., 2023) se publicó precisamente para estudiar estos rasgos con datos reales."),
  Salto(),
];

// ---------- 3. Hipótesis ----------
const hipotesis = [
  H1("3. Hipótesis"),
  H2("3.1 Hipótesis de investigación"),
  P("**H1 — Repetición:** más de un tercio de los pedidos de clientes con historial van a un restaurante que ya conocían, y esa proporción crece con el número de pedidos previos."),
  P("**H2 — Centralidad y popularidad:** en el grafo de restaurantes que comparten clientes, PageRank y HITS ordenan a los restaurantes casi igual que su número de pedidos (correlación de Spearman mayor que 0.8)."),
  P("**H3 — Vínculos personalizados:** una caminata aleatoria con reinicio desde el historial del cliente supera a “Lo de siempre” en NDCG@10 en la prueba final, con un intervalo de confianza pareado del 95% que excluye el cero."),
  P("**H4 — Descubrimiento:** ningún modelo recupera más del 10% de los restaurantes nuevos para el cliente; repetir y descubrir se comportan como tareas distintas."),
  P("**H5 — Restaurantes con poca historia:** los métodos de popularidad no colocan restaurantes con 1 a 50 pedidos previos frente al cliente correcto, mientras que los métodos basados en vínculos sí lo hacen en una fracción medible."),
  H2("3.2 Hipótesis nula"),
  P("**H₀:** los métodos basados en vínculos no se distinguen de las bases simples (popularidad y repetición del historial) en la recuperación de los restaurantes que los clientes piden después, y las diferencias observadas se deben al azar del muestreo de clientes."),
  Salto(),
];

// ---------- 4. Desarrollo ----------
const desarrollo = [
  H1("4. Desarrollo"),
  H2("4.1 Fuentes de datos"),
  Tabla(["Fuente", "Registros", "Contenido", "Uso"], [
    ["orders_sg_train.txt", `${miles(R.auditoria_datos.train.lineas)} líneas`, "Días 0–75; una fila por producto", "Historial, grafo, entrenamiento"],
    ["orders_sg_test.txt", `${miles(R.auditoria_datos.test.lineas)} líneas`, "Días 76–90", "Prueba final"],
    ["vendors_sg.txt", `${miles(R.vendors)} restaurantes`, "Cocina, geohash, cadena", "Candidatos por zona, contenido"],
    ["products_sg.txt", `${miles(R.productos)} ofertas`, "Nombre y precio normalizado", "Reglas de producto, demo"],
  ], [2300, 1700, 2560, 2800]),
  Nota(`Tabla 1. Archivos del DHRD de Singapur. Los pedidos se reconstruyen por order_id: ${miles(R.pedidos_train)} en entrenamiento y ${miles(R.pedidos_test)} en prueba.`),
  H2("4.2 Arquitectura del proyecto"),
  P("El trabajo se organizó en tres piezas, cada una con una responsabilidad única:"),
  Bullet("**Notebook `01_motor_recomendacion.ipynb`** (11 secciones y un anexo): carga y auditoría de claves, exploración, repetición, elementos frecuentes, vínculos, comunidades, recomendadores, selección, segmentos, t-SNE y exportación de resultados con semilla fija (42)."),
  Bullet("**Script `02_export_demo.py`:** recalcula el modelo elegido para doce personas de ejemplo y exporta sus listas, explicaciones y resultados a `web/demo.json`."),
  Bullet("**Sitio `web/`:** presentación y demo interactiva publicadas con GitHub Pages, que leen los resultados exportados sin servidor."),
  H2("4.3 Auditoría de los datos"),
  P(`Antes de analizar se verificaron claves y consistencia: índices y pedidos disjuntos entre entrenamiento y prueba, ningún pedido con más de un restaurante y ningún conflicto de metadatos dentro de un pedido. Se encontraron ${R.auditoria_datos.train.lineas_oferta_sin_catalogo + R.auditoria_datos.test.lineas_oferta_sin_catalogo} líneas cuya combinación restaurante–producto no aparece en el catálogo; se conservaron sin imputar. El precio está normalizado y no representa moneda.`),
  H2("4.4 Protocolo de evaluación temporal"),
  P(`La selección del modelo no usa la prueba final. Con los días 0–${R.ejecucion.configuracion.CORTE_VALIDACION} se ajustan todos los modelos y se comparan en los días ${R.ejecucion.configuracion.CORTE_VALIDACION + 1}–75 (validación). Elegido el modelo, se reajusta con los días 0–75 y se evalúa una sola vez en los días 76–90. La regla de selección se fijó antes: el mayor NDCG@10 de validación, pero si un modelo más simple no se distingue de él (intervalo pareado que incluye el cero), se prefiere el más simple.`),
  P(`La tarea es recomendar diez restaurantes y compararlos con **todos los restaurantes distintos** que el cliente pidió en los quince días siguientes, incluidos los que ya conocía. Se evalúan ${miles(R.usuarios_eval)} clientes con historial elegidos al azar y, aparte, ${miles(R.usuarios_nuevos.n_evaluados)} clientes sin historial.`),
  H2("4.5 Candidatos por zona"),
  P(`Todos los modelos eligen entre los mismos candidatos: restaurantes en el geohash de cinco caracteres de la **última dirección conocida** del cliente y sus ocho celdas vecinas (en promedio ${miles(R.auditoria_test.candidatos_media)} restaurantes). Nunca se usa la dirección del pedido futuro. El ${pct(R.auditoria_test.relevantes_geograficamente_elegibles_pct)} de los objetivos de prueba cae dentro de esa zona; el resto cuenta como fallo para todos los modelos.`),
  H2("4.6 Modelos comparados"),
  Tabla(["Modelo", "Tema", "Idea"], [
    ["Popularidad y popularidad reciente", "4.1", "Los más pedidos en total o en los últimos 14 días"],
    ["Lo de siempre", "4.1", "Los restaurantes del cliente, por frecuencia"],
    ["Contenido", "4.2", "Coseno entre perfil del cliente y atributos del restaurante"],
    ["CF ítem-ítem", "4.3", `Restaurantes similares por clientes compartidos (${R.cf_vecinos} vecinos)`],
    ["ALS y SVD truncado", "4.4 y 1.2", `Factores latentes (${R.als_factores} dimensiones)`],
    ["Caminata aleatoria (PPR)", "3.4", `Reinicio al historial, α = ${R.ejecucion.configuracion.PPR_ALPHA}, grafo podado a 15 vecinos`],
    ["Híbridos de peso fijo", "4.3", `w · frecuencia + (1 − w) · ${R.componente_descubrimiento}, con w = 0.25, 0.50, 0.75`],
  ], [3000, 1300, 5060]),
  Nota("Tabla 2. Recomendadores evaluados. El componente explorador de los híbridos se eligió por recall de restaurantes nuevos en validación."),
  H2("4.7 Controles de validez"),
  P("Durante la revisión del proyecto se corrigieron tres puntos que podían sesgar la lectura de los resultados:"),
  Bullet("**Incertidumbre del modelo elegido.** La tabla de intervalos de la prueba final compara ahora el modelo elegido en validación contra cada alternativa. El híbrido cuyo peso venía de un clasificador calibrado se trata como experimento negativo (Anexo B)."),
  Bullet("**Personas del demo.** Los grupos se definen solo con pedidos anteriores al corte y las personas se sortean con semilla fija, sin mirar si el modelo acertó. Junto a cada caso se muestra el acierto promedio de su grupo."),
  Bullet("**Explicaciones.** Cada recomendación nueva se atribuye al restaurante del historial que más aporta a su puntaje, usando la descomposición exacta de la caminata aleatoria."),
  Salto(),
];

// ---------- 5. Resultados ----------
const filasModelos = R.tabla_modelos.map((m) => [
  m.modelo, d(m["precision@10"]), d(m["recall@10"]), d(m["ndcg@10"]),
  d(m["recall repetidos"]), d(m["recall nuevos"]), d(m.cobertura, 1),
]);
const resultados = [
  H1("5. Resultados"),
  H2("5.1 Demanda y repetición"),
  P(`El conjunto de Singapur reúne ${miles(R.lineas_totales)} líneas de producto, ${miles(R.pedidos_train + R.pedidos_test)} pedidos, ${miles(R.usuarios_total)} clientes y ${miles(R.vendors)} restaurantes de ${R.cocinas} tipos de cocina. La matriz cliente × restaurante es extremadamente dispersa: solo el ${pct(R.densidad_matriz, 4)} de sus celdas tiene algún pedido, con ${d(R.pedidos_por_usuario)} pedidos y ${d(R.vendors_por_usuario)} restaurantes distintos por cliente en promedio.`),
  P(`La demanda está concentrada: el 10% de los restaurantes con pedidos acumula el **${pct(R.concentracion_top10_vendors)}** de los pedidos y el 20% llega al ${pct(R.concentracion_top20_vendors)}.`),
  ...Figura(path.join(REPO, "figs/01_cola_larga.png"), "Figura 1. Concentración de la demanda: proporción acumulada de pedidos según la proporción de restaurantes, ordenados de más a menos pedidos.", 470),
  P(`La hora pico es a las ${R.hora_pico}:00 (${pct(R.hora_pico_pct)} de los pedidos) y el sábado concentra la mayor proporción semanal (${pct(R.dia_pico_pct)}).`),
  ...Figura(path.join(REPO, "figs/02_ritmo.png"), "Figura 2. Pedidos por hora del día y promedio de pedidos por día de la semana, ajustado por cuántas fechas de cada día se observaron.", 560),
  P(`**Repetir es la norma.** El **${pct(R.tasa_repeticion)}** de los pedidos de prueba de clientes con historial va a un restaurante que ya conocían (${pct(tasaRepTotal)} sobre todos los pedidos de prueba). La proporción crece con el historial: ${pct(R.repeticion_por_segmento["1"])} con un pedido previo y ${pct(R.repeticion_por_segmento["20+"])} con veinte o más. Al mismo tiempo, el ${pct(R.pct_usuarios_test_nuevos)} de los clientes de prueba no tiene ningún pedido anterior.`),
  ...Figura(path.join(REPO, "figs/03_repeticion.png"), "Figura 3. Proporción de pedidos de prueba que van a un restaurante ya conocido, según el número de pedidos previos del cliente.", 470),

  H2("5.2 Elementos frecuentes y secuencias"),
  P(`Con soporte mínimo de 2%, Apriori y FP-Growth encontraron los mismos ${R.itemsets_frecuentes} conjuntos frecuentes de cocinas (medianas de tres ejecuciones: ${d(R.apriori_segundos)} s y ${d(R.fpgrowth_segundos)} s). Con solo ${R.canastas_cocinas} ítems posibles, Apriori resultó más rápido en esta implementación: la ventaja de FP-Growth aparece cuando hay muchos ítems y canastas largas.`),
  Tabla(["Regla", "Soporte", "Confianza", "Lift"], R.reglas_cocina.slice(0, 6).map((r) =>
    [`${r.antecedente} → ${r.consecuente}`, pct(r.soporte), pct(r.confianza), d(r.lift)]), [4560, 1600, 1600, 1600], { numericas: [1, 2, 3] }),
  Nota(`Tabla 3. Reglas entre tipos de cocina con mayor soporte. Denominador: ${miles(R.canastas_n)} clientes; las reglas describen preferencias de un mismo cliente en el periodo, no productos de un mismo pedido.`),
  P(`Dentro de un mismo pedido, los pares más frecuentes son complementos evidentes: por ejemplo, ${R.pares_producto[0].a.replace(/[^\x00-\x7F]+/g, "").trim()} con ${R.pares_producto[0].b.replace(/[^\x00-\x7F]+/g, "").trim()} aparecen juntos en ${R.pares_producto[0].juntos} pedidos, con confianza de ${pct(R.pares_producto[0].confianza)}. Las secuencias de PrefixSpan sobre ${miles(R.secuencias_n)} clientes muestran sobre todo **repetición de cocina**: ${R.patrones_secuencia[0].patron} (${pct(R.patrones_secuencia[0].soporte)}), ${R.patrones_secuencia[1].patron} (${pct(R.patrones_secuencia[1].soporte)}) y ${R.patrones_secuencia[2].patron} (${pct(R.patrones_secuencia[2].soporte)}).`),

  H2("5.3 Vínculos y comunidades"),
  P(`El grafo une dos restaurantes si comparten al menos ${R.grafo_metadatos.min_clientes_compartidos} clientes: ${miles(R.grafo_metadatos.nodos_con_aristas)} restaurantes conectados por ${miles(R.grafo_metadatos.aristas)} aristas y ${miles(R.grafo_metadatos.nodos_aislados)} aislados. **PageRank** tiene correlación de Spearman de **${d(R.correlacion_pagerank_popularidad, 3)}** con el número de pedidos y **HITS** binario de **${d(R.correlacion_hits_popularidad, 3)}**: en este grafo, la centralidad casi repite la popularidad.`),
  P(`HITS ponderado por número de pedidos ilustra un riesgo conocido del método: un solo restaurante concentra el ${pct(R.hits_metadatos.masa_cuadratica_max_ponderado_pct)} de la masa de autoridad, y en él un único cliente hizo ${R.hits_metadatos.pedidos_cliente_max_en_vendor_ponderado} de sus ${R.hits_metadatos.pedidos_vendor_max_ponderado} pedidos. Por eso la versión principal usa la matriz binaria.`),
  P(`Louvain, sobre el grafo podado a las 15 aristas más fuertes de cada nodo, encontró **${R.n_comunidades} comunidades** con modularidad **${d(R.modularidad, 3)}**. Las comunidades más grandes mezclan cocinas y se concentran en zonas geográficas, de modo que reflejan tanto ubicación como gusto.`),
  Tabla(["Comunidad", "Restaurantes", "Pedidos", "Cocinas dominantes", "Zonas"], R.comunidades.slice(0, 5).map((c) =>
    [String(c.comunidad), miles(c.restaurantes), miles(c.pedidos), c.cocinas, c.zonas]), [1200, 1300, 1300, 3760, 1800], { numericas: [1, 2] }),
  Nota("Tabla 4. Las cinco comunidades más grandes del grafo de restaurantes."),

  H2("5.4 Comparación de recomendadores"),
  P(`En validación, la regla de selección eligió la **${R.modelo_seleccionado_validacion}** (NDCG@10 de ${d(pprVal["ndcg@10"])}). La tabla siguiente es la prueba final, que solo describe y no cambia la elección.`),
  Tabla(["Modelo", "P@10", "R@10", "NDCG", "Conocidos", "Nuevos", "Cobert."], filasModelos,
    [3060, 900, 900, 1000, 1200, 1100, 1200], { resaltar: (f) => f[0] === R.modelo_seleccionado_validacion, numericas: [1, 2, 3, 4, 5, 6] }),
  Nota("Tabla 5. Prueba final (días 76–90), 20,000 clientes con historial; valores en porcentaje y NDCG × 100. Conocidos y nuevos son recall de restaurantes ya visitados o nuevos para el cliente. En negritas: modelo elegido en validación."),
  ...Figura(path.join(REPO, "figs/04_modelos.png"), "Figura 4. NDCG@10 de cada modelo en la prueba final; en rojo, el modelo elegido en validación.", 500),
  P(`La caminata aleatoria logra **NDCG@10 de ${d(PPR["ndcg@10"])}** y recall@10 de ${pct(PPR["recall@10"])}. La comparación que importa es contra repetir el historial: **+${d(cSiempre.delta_ndcg_pp)} puntos** sobre “Lo de siempre” (${d(SIEMPRE["ndcg@10"])}), es decir **+${d(R.mejora_sobre_lo_de_siempre, 1)}% relativo**. Contra la popularidad reciente la razón es de unas ${d(R.mejora_sobre_popularidad, 0)} veces, pero esa base casi nunca acierta (recall de ${pct(POPREC["recall@10"])}), así que la cifra dice más de la base que del modelo.`),
  Tabla(["Modelo elegido contra…", "Δ NDCG (pp)", "IC 95% pareado", "Lectura"], R.incertidumbre.comparaciones.map((c) =>
    [c.b, (c.delta_ndcg_pp >= 0 ? "+" : "") + d(c.delta_ndcg_pp), ic(c), c.ci95_pp[0] > 0 ? "PPR es mejor" : c.ci95_pp[1] < 0 ? "PPR es peor" : "Sin diferencia concluyente"]),
  [3400, 1500, 2200, 2260], { resaltar: (f) => f[3] === "Sin diferencia concluyente", numericas: [1] }),
  Nota(`Tabla 6. Bootstrap pareado por cliente (${R.incertidumbre.comparaciones[0].repeticiones} réplicas) en la prueba final. Descriptivo, sin corrección por comparaciones múltiples.`),
  P(`La caminata supera con intervalo que excluye el cero a todas las alternativas excepto al **híbrido de peso fijo w = 0.75** (Δ = ${d(cW75.delta_ndcg_pp)} pp, IC ${ic(cW75)}). Ese híbrido también quedó empatado en validación, y la regla eligió la caminata por ser más simple.`),
  ...Figura(path.join(REPO, "figs/07_repetir_vs_nuevos.png"), "Figura 5. Recall de restaurantes ya conocidos y de restaurantes nuevos para el cliente, por modelo.", 500),

  H2("5.5 Poca historia, sin historial y descubrimiento"),
  P(`**Repetir y descubrir son tareas distintas.** La caminata recupera el ${pct(PPR["recall repetidos"])} de los restaurantes conocidos que el cliente vuelve a pedir, pero solo el ${pct(PPR["recall nuevos"])} de los nuevos. El máximo observado en nuevos es ${pct(nuevosMax["recall nuevos"])} (${nuevosMax.modelo}), a costa de perder casi la mitad de los conocidos.`),
  P(`En restaurantes con 1 a 50 pedidos previos (${miles(R.n_vendors_pequenos)} restaurantes, ${pct(R.pct_vendors_pequenos)} del catálogo), la caminata recupera **${frio.aciertos} de ${miles(frio.relevantes)} objetivos (${pct(frio.recall_micro_pct)})**; ambas popularidades recuperan cero. En restaurantes sin ningún pedido previo solo el modelo de contenido acierta algo (${pct(ceroCont.recall_micro_pct)}), porque es el único que no depende de interacciones.`),
  ...Figura(path.join(REPO, "figs/05_arranque_frio.png"), "Figura 6. Recall@10 de objetivos en restaurantes con 1 a 50 pedidos previos.", 480),
  P(`Para los ${miles(R.usuarios_nuevos.n_disponibles)} clientes de prueba sin historial, el respaldo de popularidad reciente global obtiene recall@10 de ${pct(sinHist["recall@10"])} y NDCG@10 de ${d(sinHist["ndcg@10"])}: sin historial ni dirección previa, la recomendación personalizada no tiene de dónde partir.`),

  H2("5.6 Factores latentes y demo"),
  ...Figura(path.join(REPO, "figs/06_mapa_tsne.png"), "Figura 7. Proyección t-SNE de los factores ALS de los 2,500 restaurantes más pedidos, coloreada por las cuatro cocinas más frecuentes. Es exploratoria.", 380),
  P("La proyección muestra regiones donde predominan ciertas cocinas, pero también mucha mezcla: los factores capturan algo más que el tipo de comida (por ejemplo, zona y hábitos de compra compartidos)."),
  P("El demo web muestra doce personas, tres por grupo, con su historial, sus diez recomendaciones explicadas y lo que pidieron después. Como las personas se sortean, cada caso se presenta junto al promedio de una muestra de 2,000 personas de su grupo:"),
  Tabla(["Grupo (definido con entrenamiento)", "Elegibles", "Con ≥ 1 acierto", "Aciertos / objetivos"], Object.entries(arq).map(([k, a]) =>
    [k, miles(a.elegibles), pct(a.pct_con_algun_acierto, 1), `${d(a.aciertos_promedio)} / ${d(a.objetivos_promedio)}`]),
  [3560, 1600, 1900, 2300], { numericas: [1, 2, 3] }),
  Nota("Tabla 7. Acierto del modelo elegido por grupo del demo (muestra aleatoria de 2,000 personas por grupo). Fiel: 12+ pedidos y 3+ pedidos por restaurante; explorador: 10+ restaurantes y menos de 1.4 pedidos por restaurante; ocasional: 2 a 4 pedidos."),
  Salto(),
];

// ---------- 6. Conclusiones ----------
const conclusiones = [
  H1("6. Conclusiones"),
  H2("6.1 Contrastación de hipótesis"),
  Tabla(["H", "Predicción", "Evidencia", "Veredicto"], [
    ["H1", "Más de un tercio repite; crece con el historial", `${pct(R.tasa_repeticion)}; de ${pct(R.repeticion_por_segmento["1"], 1)} (1 pedido) a ${pct(R.repeticion_por_segmento["20+"], 1)} (20+)`, "CONFIRMADA"],
    ["H2", "Centralidad ≈ popularidad (ρ > 0.8)", `PageRank ρ = ${d(R.correlacion_pagerank_popularidad, 2)}; HITS ρ = ${d(R.correlacion_hits_popularidad, 2)}`, "CONFIRMADA"],
    ["H3", "PPR supera a “Lo de siempre” con IC que excluye 0", `+${d(cSiempre.delta_ndcg_pp)} pp NDCG, IC ${ic(cSiempre)}`, "CONFIRMADA"],
    ["H4", "Nadie supera 10% en restaurantes nuevos", `Máximo ${pct(nuevosMax["recall nuevos"])} (${nuevosMax.modelo.split(" ")[0]}); PPR ${pct(PPR["recall nuevos"])}`, "CONFIRMADA"],
    ["H5", "Popularidad no coloca restaurantes con poca historia; vínculos sí", `PPR ${pct(frio.recall_micro_pct)}; popularidad 0%`, "CONFIRMADA"],
  ], [600, 3100, 3960, 1700], { resaltar: () => false }),
  Nota("Tabla 8. Contraste de hipótesis con los resultados de la prueba final. Se rechaza H₀ en la comparación contra las bases simples."),
  H2("6.2 Hallazgos principales"),
  P(`El hallazgo central es que **en comida a domicilio repetir es la base a vencer**. Una lista que solo devuelve los lugares de siempre ya logra NDCG@10 de ${d(SIEMPRE["ndcg@10"])}, muy por encima de cualquier ranking de popularidad. La caminata aleatoria con reinicio la supera por ${d(cSiempre.delta_ndcg_pp)} puntos porque conserva lo conocido (el reinicio al historial) y agrega restaurantes alcanzables por clientes compartidos.`),
  P(`El segundo hallazgo es que **descubrir sigue abierto**: ningún método recupera más del ${d(Math.ceil(nuevosMax["recall nuevos"]), 0)}% de los restaurantes nuevos para el cliente, y los que más descubren pierden lo conocido. En los fallos del demo, todos los destinos eran restaurantes que la persona nunca había pedido.`),
  P("El tercero es metodológico: la centralidad global del grafo apenas agrega información a la popularidad, pero la **misma estructura de vínculos personalizada** desde cada cliente sí produce el mejor recomendador y el único que coloca restaurantes con poca historia sin depender de su popularidad."),
  H2("6.3 Implicaciones para una plataforma de pedidos"),
  P("**CONSERVAR:** los lugares conocidos deben seguir en la lista; un motor que los sustituya por novedades empeora la experiencia de quien ya sabe lo que quiere."),
  P("**DESCUBRIR:** la exploración necesita un objetivo propio y una métrica propia (recall de nuevos), no un ajuste fino del mismo ranking."),
  P("**EXPLICAR:** como el puntaje de la caminata se descompone exactamente por restaurante del historial, cada sugerencia puede mostrar su razón (“por tus pedidos en…”) sin aproximaciones."),
  P("**MEDIR:** la evaluación es fuera de línea; mide si se recupera lo que el cliente pidió, no si habría pedido otra cosa al ver la lista. Ese efecto solo lo responde un experimento con usuarios."),
  H2("6.4 Contribución desde Datos Masivos II"),
  P("El proyecto recorre las cinco unidades del programa: el método de potencias, la SVD y t-SNE (Unidad 1) sostienen PageRank, HITS, los factores latentes y la exploración visual; Apriori, FP-Growth y PrefixSpan (Unidad 2) describen canastas y secuencias de cocinas; PageRank, HITS y las caminatas aleatorias (Unidad 3) estructuran el grafo y producen el mejor recomendador; contenido, filtrado colaborativo, factores latentes y evaluación con validación temporal (Unidad 4) forman la comparación central; y Louvain (Unidad 5) describe comunidades de restaurantes. Todo se ejecuta con matrices dispersas sobre dos millones de pedidos en una computadora sin GPU, en unos ocho minutos."),
  H2("6.5 Limitaciones"),
  Bullet("Datos de una sola ciudad (Singapur) y 91 días; usar el método en México exige datos locales y nueva validación."),
  Bullet("El catálogo es estático: no hay horarios, cierres ni radios de reparto reales; la zona es una aproximación por geohash."),
  Bullet("El bootstrap es descriptivo y no corrige por comparaciones múltiples."),
  Bullet("Los nombres de restaurante no se publican; el demo los identifica por su producto más pedido."),
  H2("6.6 Trabajo futuro"),
  Bullet("Un objetivo explícito de descubrimiento (por ejemplo, re-ranking por novedad con restricción de recall de conocidos)."),
  Bullet("Comunidades traslapadas y similitud entre nodos (temas 5.4 y 5.5) para proponer restaurantes nuevos desde varias comunidades del cliente."),
  Bullet("Un piloto en línea que mida si las listas cambian decisiones de pedido."),
  Salto(),
];

// ---------- 7. Referencias ----------
const refs = [
  "Aggarwal, C. C. (2016). *Recommender Systems: The Textbook*. Springer.",
  "Assylbekov, Y., Bali, R., Bovard, L. y Klaue, C. (2023). Delivery Hero Recommendation Dataset: A Novel Dataset for Benchmarking Recommendation Algorithms. *RecSys ’23*. https://doi.org/10.1145/3604915.3610242",
  "Blondel, V. D., Guillaume, J.-L., Lambiotte, R. y Lefebvre, E. (2008). Fast unfolding of communities in large networks. *Journal of Statistical Mechanics*, P10008.",
  "Han, J., Pei, J. y Yin, Y. (2000). Mining frequent patterns without candidate generation. *SIGMOD ’00*, 1–12.",
  "Hu, Y., Koren, Y. y Volinsky, C. (2008). Collaborative filtering for implicit feedback datasets. *ICDM ’08*, 263–272.",
  "Kleinberg, J. M. (1999). Authoritative sources in a hyperlinked environment. *Journal of the ACM*, 46(5), 604–632.",
  "Leskovec, J., Rajaraman, A. y Ullman, J. D. (2020). *Mining of Massive Datasets* (3.ª ed.). Cambridge University Press. http://www.mmds.org/",
  "Page, L., Brin, S., Motwani, R. y Winograd, T. (1999). The PageRank citation ranking: Bringing order to the web. Stanford InfoLab.",
  "Pei, J. et al. (2001). PrefixSpan: Mining sequential patterns efficiently by prefix-projected pattern growth. *ICDE 2001*, 215–224.",
  "Van der Maaten, L. y Hinton, G. (2008). Visualizing data using t-SNE. *Journal of Machine Learning Research*, 9, 2579–2605.",
  "Agrawal, R. y Srikant, R. (1994). Fast algorithms for mining association rules. *VLDB ’94*, 487–499.",
  "UNAM, IIMAS. (2024). Plan de estudios de la Licenciatura en Ciencia de Datos: Datos Masivos II (clave 0702).",
].sort((a, b) => a.localeCompare(b, "es"));
const referencias = [
  H1("7. Referencias"),
  ...refs.map((r, i) => new Paragraph({ spacing: { after: 100 }, indent: { left: 440, hanging: 440 }, children: runs(`[${i + 1}] ${r}`, { size: 19 }) })),
  Salto(),
];

// ---------- Anexo A ----------
const anexoA = [
  H1("Anexo A — Código clave"),
  Nota("Fragmentos del notebook organizados por tema del programa. Se omiten configuración, rutas y gráficas."),
  ...Codigo("A.1 PageRank por el método de potencias", "Temas 1.1 y 3.1 — Método de potencias y PageRank",
    "La matriz de transición se normaliza por columnas; la masa de los nodos sin aristas se reparte de manera uniforme para conservar una distribución de probabilidad.", [
      "def pagerank_potencias(X, d=0.85, tol=1e-10, max_iter=200):",
      "    n = X.shape[0]",
      "    P, tiene_grado = normaliza_columnas(X)   # columna-estocástica",
      "    r = np.full(n, 1.0 / n)",
      "    sin_grado = ~tiene_grado",
      "    for it in range(max_iter):",
      "        nuevo = d * (P @ r) + d * r[sin_grado].sum() / n + (1 - d) / n",
      "        delta = np.abs(nuevo - r).sum()",
      "        r = nuevo",
      "        if delta < tol:",
      "            break",
      "    return r, it + 1, delta",
    ]),
  ...Codigo("A.2 HITS sobre la matriz bipartita", "Tema 3.2 — Búsqueda de tópicos inducida por hipervínculos",
    "Hubs (clientes) y autoridades (restaurantes) se refuerzan mutuamente; equivale a obtener los vectores singulares dominantes.", [
      "def hits(X, max_iter=2000, tol=1e-8):",
      "    a = np.ones(X.shape[1]) / np.sqrt(X.shape[1])",
      "    for it in range(max_iter):",
      "        h = X @ a;   h /= np.linalg.norm(h) or 1",
      "        nuevo = X.T @ h;   nuevo /= np.linalg.norm(nuevo) or 1",
      "        if np.abs(nuevo - a).sum() < tol:",
      "            a = nuevo; break",
      "        a = nuevo",
      "    return X @ a / np.linalg.norm(X @ a), a",
    ]),
  ...Codigo("A.3 Apriori y FP-Growth con resultados verificados", "Temas 2.1, 2.2 y 2.5 — Mercado-canasta, Apriori y FP-Growth",
    "Una canasta por cliente con las cocinas que pidió. El notebook comprueba que ambos algoritmos producen los mismos conjuntos y soportes.", [
      "canastas = (ped_tr.groupby(['customer_id', 'cocina']).size()",
      "            .unstack(fill_value=0) > 0)",
      "frec_fp = fpgrowth(canastas, min_support=0.02, use_colnames=True)",
      "frec_ap = apriori(canastas, min_support=0.02, use_colnames=True)",
      "sup_fp = dict(zip(frec_fp.itemsets, frec_fp.support))",
      "sup_ap = dict(zip(frec_ap.itemsets, frec_ap.support))",
      "assert sup_fp.keys() == sup_ap.keys()",
      "reglas = association_rules(frec_fp, metric='lift', min_threshold=1.0)",
    ]),
  ...Codigo("A.4 PrefixSpan", "Tema 2.6 — Algoritmo PrefixSpan",
    "Proyección recursiva: para cada prefijo frecuente se cuentan los símbolos que pueden extenderlo en el resto de cada secuencia.", [
      "def recurre(prefijo, proyectada):",
      "    conteo = {}",
      "    for idx, pos in proyectada:",
      "        for s in set(secuencias[idx][pos:]):",
      "            conteo[s] = conteo.get(s, 0) + 1",
      "    for simbolo, c in conteo.items():",
      "        if c < min_sup: continue",
      "        nuevo = prefijo + [simbolo]",
      "        resultados.append((tuple(nuevo), c))",
      "        if len(nuevo) < max_len:",
      "            recurre(nuevo, proyecta(proyectada, simbolo))",
    ]),
  ...Codigo("A.5 Caminata aleatoria con reinicio (modelo elegido)", "Temas 3.4 y 4.3 — Caminatas aleatorias y filtrado colaborativo",
    "Por lotes de 500 clientes: el reinicio vuelve al historial normalizado del cliente; la masa de nodos colgantes también regresa al perfil.", [
      "def _ppr(idx, b=base):",
      "    p0 = b['M'][idx].toarray()",
      "    p0 /= p0.sum(axis=1, keepdims=True)",
      "    x = p0.copy()",
      "    for iteracion in range(60):",
      "        faltante = x[:, b['dangling']].sum(axis=1, keepdims=True)",
      "        nuevo = ALFA * (x @ b['P'] + faltante * p0) + (1 - ALFA) * p0",
      "        residuo = np.abs(nuevo - x).sum(axis=1).max()",
      "        x = nuevo",
      "        if residuo < 1e-5: break",
      "    return x",
    ]),
  ...Codigo("A.6 Atribución exacta de cada recomendación", "Tema 3.4 — Linealidad de la caminata con reinicio",
    "La caminata del cliente es proporcional a la suma ponderada de caminatas que parten de cada restaurante de su historial; el script lo comprueba antes de exportar.", [
      "pesos = M[fila, hist_idx].toarray().ravel(); pesos /= pesos.sum()",
      "aportes = pesos[:, None] * caminata_desde(hist_idx)   # historial × catálogo",
      "puntaje = ppr(np.array([fila]))[0]",
      "suma = aportes.sum(axis=0)",
      "escala = puntaje.sum() / suma.sum()",
      "assert np.abs(suma * escala - puntaje).max() <= 1e-4 * puntaje.max()",
      "origen = hist_idx[np.argmax(aportes[:, j])]   # razón de la recomendación j",
    ]),
  ...Codigo("A.7 Factores latentes: ALS y SVD truncado", "Temas 4.4 y 1.2 — Modelo de factor latente y SVD",
    "Ambos se ajustan sobre la matriz dispersa de conteos cliente × restaurante.", [
      "model = implicit.als.AlternatingLeastSquares(",
      "    factors=64, regularization=0.05, alpha=20.0, iterations=20,",
      "    random_state=SEED)",
      "model.fit(base['M'])",
      "scores_als = lambda idx: U[idx] @ V.T",
      "",
      "left, singular, right = svds(base['M'].astype(np.float64), k=64)",
      "scores_svd = lambda idx: (left[idx] * singular) @ right",
    ]),
  ...Codigo("A.8 Comunidades con Louvain", "Tema 5.3 — Descubrimiento de comunidades",
    "Se conservan las 15 aristas más fuertes de cada nodo y se excluyen los aislados.", [
      "G = nx.Graph()",
      "G.add_nodes_from(activos_grafo.tolist())",
      "G.add_weighted_edges_from(aristas[['i', 'j', 'w']].itertuples(index=False))",
      "comunidades = nx.community.louvain_communities(G, weight='weight', seed=SEED)",
      "Q = nx.community.modularity(G, comunidades, weight='weight')",
    ]),
  ...Codigo("A.9 NDCG@10 y bootstrap pareado", "Tema 4.5 — Evaluación de sistemas de recomendación",
    "El denominador ideal usa todos los objetivos del cliente, incluso los que quedan fuera de su zona.", [
      "def ndcg_en_k(recomendados, relevantes, k=10, n_relevantes=None):",
      "    dcg = sum(1/np.log2(i+2) for i, v in enumerate(recomendados[:k]) if v in relevantes)",
      "    n = len(relevantes) if n_relevantes is None else n_relevantes",
      "    ideal = sum(1/np.log2(i+2) for i in range(min(n, k)))",
      "    return dcg / ideal if ideal else 0.",
      "",
      "def bootstrap_pareado(ctx, a, b, reps=1000):",
      "    diff = (ctx['metrics'][a].ndcg - ctx['metrics'][b].ndcg).to_numpy() * 100",
      "    rng = np.random.default_rng(SEED + 301)",
      "    medias = [diff[rng.integers(0, len(diff), len(diff))].mean() for _ in range(reps)]",
      "    return diff.mean(), np.quantile(medias, [.025, .975])",
    ]),
  Salto(),
];

// ---------- Anexo B ----------
const cmpB = anexo.test.comparaciones_vs_pesos_fijos;
const anexoB = [
  H1("Anexo B — Experimento negativo: híbrido calibrado"),
  P("Se probó un híbrido cuyo peso de repetición no era fijo, sino la probabilidad, estimada para cada cliente, de que su primer pedido siguiente fuera a un restaurante conocido. Una regresión logística con variables de los últimos treinta días (pedidos, restaurantes distintos, recencia, hora media, proporción en fin de semana) se ajustó en una ventana y se calibró con una sigmoide en una ventana posterior disjunta."),
  P(`El clasificador ordena a los clientes solo de manera débil (**AUC = ${d(clfTest.auc, 3)}**) y, aun calibrado, subestima la repetición: su probabilidad media es ${pct(clfTest.probabilidad_media * 100, 1)} frente a una tasa real de ${pct(clfTest.tasa_real * 100, 1)}, porque la tasa de repetición cambia entre la ventana de calibración y la de evaluación. Usado como peso, el híbrido obtiene NDCG@10 de ${d(calTest["ndcg@10"])} en la prueba final:`),
  Tabla(["Híbrido calibrado contra…", "Δ NDCG (pp)", "IC 95% pareado"], cmpB.map((c) =>
    [c.b, (c.delta_ndcg_pp >= 0 ? "+" : "") + d(c.delta_ndcg_pp), ic(c)]), [4360, 2000, 3000], { numericas: [1] }),
  Nota("Tabla B.1. Bootstrap pareado en la prueba final. El mismo patrón se observa en validación."),
  P("Rinde menos que los pesos fijos de 0.50 y 0.75, y solo supera al de 0.25. Por eso se documenta como experimento negativo y no forma parte de la selección ni de las tablas principales: una probabilidad mal calibrada en el tiempo no es mejor peso que una constante bien elegida."),
];

// ---------- documento ----------
const pie = new Footer({ children: [new Paragraph({
  style: "PiePagina", alignment: AlignmentType.RIGHT,
  children: [new TextRun({ children: [PageNumber.CURRENT] })],
})] });

const doc = new Document({
  creator: ESTUDIANTE, title: "A domicilio: motor de recomendación de restaurantes", description: "Proyecto final de Datos Masivos II",
  styles: {
    default: { document: { run: { font: FUENTE, size: 22 } } },
    paragraphStyles: [
      { id: "PiePagina", name: "Pie de pagina", basedOn: "Normal", run: { font: FUENTE, size: 18, color: GRIS } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FUENTE, size: 26, bold: true, color: NEGRO },
        paragraph: { spacing: { before: 120, after: 200 }, keepNext: true, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FUENTE, size: 22, bold: true, color: NEGRO },
        paragraph: { spacing: { before: 240, after: 120 }, keepNext: true, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FUENTE, size: 22, bold: true, italics: true, color: NEGRO },
        paragraph: { spacing: { before: 160, after: 100 }, keepNext: true, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [{ reference: "viñetas", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
    alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }] },
  sections: [
    { properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      children: portada },
    { properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440, header: 600, footer: 500 } } },
      footers: { default: pie },
      children: reordenar([...indice, ...objetivo, ...marco, ...hipotesis, ...desarrollo, ...resultados, ...conclusiones, ...referencias, ...anexoA, ...anexoB]) },
  ],
});
const salida = path.join(__dirname, "ProyectoFinal_MoctezumaRamirez.docx");
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(salida, buf); console.log("escrito", salida); });
module.exports = { ENTRADAS };
