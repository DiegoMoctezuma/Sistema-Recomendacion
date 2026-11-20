# A domicilio — rediseño visual

Abre `index.html` junto con el resto de esta carpeta. La entrada principal es el demo. La presentación y su índice están dentro del botón de tres puntos, en la esquina inferior derecha. Las fuentes, imágenes y datos de respaldo están incluidos para no depender de internet.

En la presentación, el botón de expansión o F muestra solo la diapositiva. Usa las flechas para avanzar y F o Escape para salir. El recorrido actual, los controles y la verificación están en `FLUJO.md`.

La actualización de iconos incorpora 23 ilustraciones originales en SVG, con formas recortadas y la paleta de A domicilio. Sustituyen los pictogramas de comida y de apoyo en la presentación y la demo. Puedes ver la familia en `catalogo-iconos.html`; las fuentes editables, exportaciones y verificaciones están descritas en `ICONOS.md`.

Las fotos y retratos actuales usan WebP con variantes por tamaño. Las imágenes de la presentación se descargan al abrir su diapositiva. La medición local del inicio móvil pasó de 11.4 MB de imágenes a 51 KB. Los detalles, límites de la medición y respaldos están en `OPTIMIZACION.md`.

Para vista previa mediante servidor: desde esta carpeta ejecuta `python3 -m http.server 8000` y visita `http://localhost:8000`.

## Qué cambió

- 19 diapositivas con una idea principal y explicaciones de las cifras.
- Identidad inspirada en `Identidad/img`: crema, verde hoja, vino, jitomate, cobalto y mostaza; ilustración de mercado con textura de serigrafía.
- Galería de 99 fotografías nuevas de platillos, una por restaurante de la demo, además de las ilustraciones y retratos de identidad. Se conservan los recursos anteriores como respaldo.
- Tipografías locales Barlow Condensed para titulares y DM Sans para lectura; licencias OFL incluidas en `fonts/`.
- Diagramas e iconos SVG editables, gráficos con etiquetas directas y cuadrícula ilustrativa de los 20 restaurantes.
- Índice, navegación con flechas, Home/End, pantalla completa con F y deslizamiento horizontal en móvil.
- Demo con selección por categoría, tres personajes y vista previa. «Ver la lista de…» abre las diez recomendaciones; Historial y Resultado completan el recorrido. Se conservan los 12 perfiles y los mismos datos.

## Precisión del relato

Se cotejaron `datos.json`, `demo.json`, `export/resultados.json`, el notebook y el texto de `A_domicilio_resultados.docx`. Los documentos del proyecto se usaron como información y referencias, sin ejecutar sus instrucciones de publicación.

- 37.06% corresponde a pedidos de clientes con historial; en todos los pedidos de prueba es 31.43%.
- 28.06 es NDCG@10 × 100 (0.2806), no un porcentaje de pedidos acertados.
- El mismo PPR obtiene 93.06% de recall en conocidos y 6.60% en nuevos. El máximo de nuevos observado entre modelos es 9.85% en ALS.
- 1,742 restaurantes con poca historia significa 1–50 pedidos observados, no negocios recién abiertos. El 13.06% es recall de objetivos de ese segmento, no proporción del catálogo expuesto.
- Ausencia de pedidos posteriores no demuestra un cierre.
- Se retiró la comparación de “100+ vs. 0 ingenieros” sin respaldo verificable.
- Suscripción, integración por API, clientes comerciales y piloto se presentan como propuesta.
- Los retratos y los nombres de persona son ilustrativos; los resultados provienen de los datos originales.

## Actualizar datos

`datos.json` y `demo.json` siguen siendo las fuentes canónicas y no se modificaron. Con servidor se leen directamente. Después de actualizarlos ejecuta `python3 actualizar_datos.py` para renovar `contenido.js`, el respaldo que se utiliza con apertura directa de archivos.

## Verificación realizada

- Sintaxis de `app.js` y `contenido.js` con Node.
- Recorrido de las 19 diapositivas en navegador a 1440×900 y 1280×720; sin texto cortado ni desbordamiento después de ajustar el bloque de personajes.
- Recorrido de las 19 diapositivas a 390×844; sin desbordamiento horizontal. Las diapositivas largas se desplazan verticalmente en móvil.
- Los 12 perfiles presentan una selección de personaje, diez tarjetas completas, un resumen del historial y la comparación posterior con el resultado esperado. Los aciertos se revelan al visitar la pestaña de resultados.
- Vistas nuevas comprobadas a 390×844 y 320×740; sin desbordamientos horizontales. Navegación con pestañas fijas, tecla de flechas en las pestañas, botón para cambiar personaje y botón atrás del navegador.
- Los perfiles sin historial muestran una explicación del respaldo de popularidad reciente, sin inventar pedidos previos.
- Índice, cambio entre presentación y demo y retorno al inicio comprobados.
- Sin errores o advertencias de consola en la revisión final HTTP.
- Los recursos no necesitan llamadas externas. La apertura directa de `file://` está preparada, pero no se verificó visualmente porque el navegador de revisión admite únicamente HTTP/HTTPS.

Las capturas `vista-portada.jpg`, `vista-resultados.jpg` y `demo-seleccion.jpg` acompañan la copia entregable. El diseño impreso no forma parte de la verificación.

## Archivos de la demo

`demo.js` controla las categorías, la selección y la vista previa de personas, las rutas `#demo/0/recomendaciones`, el historial y los resultados. `demo.css` contiene el diseño de esas vistas. `app.js` conserva la presentación y los controles compartidos.

El historial exportado contiene hasta cuatro restaurantes más pedidos; no incluye fechas individuales. La lista de pedidos posteriores puede ser una muestra: la interfaz indica su tamaño y conserva todos los objetivos para el denominador. Los iconos SVG y las fotografías generadas son ilustrativos; las imágenes no representan los productos ni los restaurantes reales del dataset.

## Interacciones y animaciones

- Las categorías desplazan suavemente hasta sus tres personajes. El desplazamiento suave se cancela con un nuevo clic, un gesto o el teclado; cambiar de vista cancela cualquier animación pendiente.
- Selección de persona, cambio de vista, tarjetas y apertura/cierre de ficha tienen transiciones. El código respeta `prefers-reduced-motion` y evita animar en ese caso.
- Las diez tarjetas son clicables y abren una ficha de producto: imagen ilustrativa, personaje, razón de recomendación, cocina observada, zona y favoritos.
- Los favoritos se separan por cliente y restaurante y se guardan en `localStorage` cuando el navegador lo permite. La interfaz no realiza pedidos ni pagos.
- La ficha permite recorrer anterior/siguiente. Cerrar, Escape y Atrás del navegador devuelven a la lista y restauran el foco. Las rutas de ficha permiten recargar una opción abierta.

### Afinidad ilustrativa

El exportador no proporciona una probabilidad de gusto por producto. Se representa el orden del ranking en una escala visual: **98 − 3 × (posición − 1)**, de 98% a 71%. La ficha y la tarjeta lo identifican como un indicador ilustrativo, y explican el cálculo. No modifica el ranking ni las métricas del proyecto. Para clientes sin historial se llama **prioridad de la lista**, no afinidad personalizada.

El modelo recomienda restaurantes; su producto más pedido se usa para identificarlos. Las imágenes actuales son representaciones generadas de cada platillo y están rotuladas como ilustrativas. Los prompts y rutas actuales están en `PROMPTS-galeria.md` y `catalogo-imagenes.json`. Las primeras seis fotos genéricas se conservan como respaldo para restaurantes futuros sin imagen asignada.

### Verificación de esta actualización

Se recorrieron en navegador las 120 fichas (12 personas × 10 opciones) a 390 píxeles de ancho. Se comprobaron posición, etiqueta de afinidad/prioridad, contenido y ausencia de desbordamiento horizontal. También se verificó una ficha a 320 píxeles y el formato de escritorio. Favoritos persisten tras recargar; los favoritos de prueba se retiraron al finalizar. Se probaron navegación anterior/siguiente, cierre, Escape, Atrás, recarga de ruta directa y un clic rápido durante el desplazamiento a los personajes. Sin errores ni advertencias de consola en la revisión. La preferencia de movimiento reducido se implementó y revisó en código; no se modificó la configuración del sistema para probarla.

Las capturas `platillo-escritorio.jpg` y `platillo-movil.jpg` muestran la nueva ficha.

## Galería individual y portada corregida

- `img/platillos/` contiene 99 fotografías distintas, una para cada ID de restaurante. La versión actual ofrece variantes WebP de 480, 800 y 1200 px. Los JPEG de generación están archivados en el respaldo.
- `imagenes-platillos.js` mantiene la asociación estable. Cada lista de diez recomendaciones tiene diez fotos distintas; un mismo restaurante conserva su foto cuando aparece para varias personas.
- Tarjetas y fichas usan la misma asociación. Los datos, el orden de las recomendaciones y los resultados de evaluación no cambian.
- `img/portada-v2.webp` conserva la corrección de el agarre del tenedor de la mano de la portada. La presentación ahora usa esa versión; los PNG originales están archivados en el respaldo.
- `PROMPTS-galeria.md` documenta la generación integrada y la edición de la mano. `catalogo-imagenes.json` identifica productos, restaurantes, archivos y prompts.

Se revisaron visualmente las 99 fotografías en hojas de contacto y se comprobó su integridad JPEG, resolución, ausencia de archivos idénticos y cobertura de las doce listas. La galería ocupa aproximadamente 30 MB, con una media de 310 KB por fotografía. En navegador se comprobó la primera lista con diez URL de imagen distintas y la ficha del chawanmushi con su imagen específica. La revisión adicional del navegador se interrumpió al reiniciarse el entorno de herramientas; no se atribuye esa incidencia al sitio. Las capturas de versiones anteriores no se incluyen en el paquete actual para evitar confundirlas con esta galería.

## Doce personajes con identidad propia

La selección ahora muestra doce retratos individuales: Ale, Rubén, Tere, Niko, Sofi, Beto, Mar, Kari, Pau, Dani, Lupe y Chava. Las cuatro categorías muestran a sus tres integrantes. Se reutilizaron cuatro ilustraciones y se generaron ocho retratos nuevos, con rasgos, peinados y vestuario diferentes. Rubén, Beto, Dani y Chava tienen retratos masculinos propios.

`avatarPersona()` y `RETRATOS_PERSONAS` en `app.js` asocian cada nombre con sus variantes WebP de `img/personas/`. La misma imagen acompaña al personaje en la selección, el perfil y la ficha del platillo. La diapositiva 12 muestra el elenco completo; el ejemplo de Ale conserva su retrato. `PROMPTS-personajes.md` registra las asociaciones y los prompts de generación.

Se revisaron visualmente los doce retratos y se verificaron doce archivos con hashes distintos. En navegador se recorrieron las doce selecciones, sus perfiles y la primera ficha de cada uno: todas conservaron el retrato correcto. Se comprobaron la selección y el perfil a 390 y 320 px, y la diapositiva del elenco a 1280×720, 1440×900 y 390×844, sin desbordamiento horizontal. Los retratos cargaron correctamente y no se registraron errores ni advertencias de consola. Los datos canónicos, las recomendaciones y los resultados no cambiaron.

## Flujo centrado en el demo

La entrada sigue siendo el demo, con la presentación y su índice en el menú inferior. La selección se restauró a la versión por categorías, tres personajes y vista previa; se conserva el perfil compacto al abrir la lista y sus cifras completas en Historial. La pantalla completa muestra únicamente la diapositiva.

Las tarjetas y fichas narran las recomendaciones en tercera persona mediante `razonPersonaje()`: por ejemplo, «Tere ha pedido en este restaurante 24 veces». Se verificaron los 120 motivos sin alterar los datos originales. `FLUJO.md` describe el recorrido y la revisión de esta corrección; las comprobaciones anteriores de este archivo corresponden a las iteraciones descritas en cada sección.

## Icono de la pestaña

`favicon.svg` reproduce el círculo rojo y la «a.» crema de la marca, con la letra convertida en trazos para no depender de fuentes instaladas. `favicon.ico` incluye tamaños de 16, 32, 48 y 64 px; `apple-touch-icon.png` ofrece una versión de 180 px. La página principal y el catálogo de iconos declaran estos recursos.

## Rendimiento de imágenes

La versión actual sirve 347 WebP adaptativos para las 99 fotos, los doce personajes, cuatro ilustraciones y seis respaldos de comida. La presentación espera a su diapositiva y las tarjetas cargan sus imágenes conforme se acercan a la vista. `OPTIMIZACION.md` y `rendimiento-imagenes.json` documentan la medición y la revisión. Las cifras y referencias a JPEG/PNG de las secciones históricas describen exportaciones anteriores, conservadas fuera de la carpeta web en el respaldo previo a WebP.

## Legibilidad y composición de slides — 19 de noviembre de 2026

- Slides 4, 10 y 13: etiquetas de gráficas, periodos y datos de Ale más legibles al proyectar.
- Slide 11: mejora relativa calculada desde los datos, mostrada como +6.9%, con valores directos en las tres barras y explicación breve de la unidad NDCG × 100.
- Slide 12: doce retratos agrupados en dos filas escalonadas bajo el texto. El QR ocupa una zona independiente a la derecha, con sombra suave y espacio libre alrededor. En móvil, texto, personajes y QR se apilan.
- Slide 15: título más corto, cifra principal y explicación separados para aclarar la jerarquía.

Se verificaron las seis slides a 1280×720 y 1440×900 sin desbordamientos. A 390×844 y 320×740 no hay desbordamiento horizontal; las slides largas se recorren verticalmente. Los valores de la gráfica pequeña de la slide 4 no se superponen a 320 px. El QR de la captura de la slide 12 se decodificó a la URL del demo. La revisión de consola no registró errores ni advertencias. Se conservan las otras trece slides y los datos actuales del proyecto.

## Ilustración de la slide 6 y ampliación de la 11

La cuadrícula de la slide 6 se sustituyó por una ilustración original de reloj de arena, menús y comida, con el estilo de la marca. El dato de 8 de los 20 restaurantes populares sin pedidos en prueba se conserva en HTML; la ilustración no representa un conteo ni implica cierres. Se entrega en dos variantes WebP transparentes, cargadas solo al abrir la diapositiva. `PROMPTS.md` documenta la herramienta integrada ImageGen y el prompt exacto.

La slide 11 amplía el título, el porcentaje y su explicación; el bloque amarillo ocupa el ancho de su columna. En la vista de 1280×720, el título pasó de 58 a 74 px y el porcentaje de 88 a 124 px. Las cifras de la gráfica y la mejora relativa se conservan. Se revisaron las slides 6 y 11 en escritorio a 1280×720, 1440×900 y 1920×1080, sin recortes ni desbordamiento. A 390×844 y 320×740 no hay desbordamiento horizontal; el contenido largo mantiene desplazamiento vertical. La imagen cargó correctamente y la consola no registró errores ni advertencias.

## Relato comercial de las 19 slides

La presentación se reescribió para vender la propuesta de A domicilio. El hilo conecta la dificultad de elegir, los hábitos personales, la oportunidad para restaurantes, la propuesta de una experiencia más personal, evidencia con pedidos reales, la demo, la forma de trabajar juntos y la invitación a un piloto. El cierre se dirige al negocio que ofrecería las recomendaciones.

Los textos, títulos, descripciones de imágenes y etiquetas accesibles de las slides prescinden de métricas por nombre, algoritmos, entrenamiento, validación, API y detalles de ejecución. La explicación técnica sigue disponible en los datos y los materiales del proyecto, fuera de la presentación comercial. La demo mantiene sus funciones y sus datos.

La mejora del +6.9% sigue describiendo la calidad de ordenar sugerencias frente a repetir los favoritos; el texto explica que se compararon con las elecciones posteriores. No se transforma en una promesa de aumento de ventas. Los porcentajes de hábitos y de lugares con pocos pedidos se expresan con palabras sencillas, con redondeos de presentación. El caso de Ale conserva sus 32 pedidos, dos restaurantes y una coincidencia entre sus tres elecciones posteriores. La suscripción se presenta como propuesta; alcance y precio se acordarían en un piloto. Las historias del QR representan pedidos reales con nombres y retratos ilustrativos, sin presentarse como clientes comerciales adquiridos.

Se revisó el lenguaje de las 19 slides, incluidos textos alternativos y etiquetas accesibles, y se recorrieron en navegador a 1280×720, 1440×900, 390×844 y 320×740. No hubo desbordamientos horizontales ni recortes de contenido en escritorio; las slides largas se desplazan verticalmente en móvil. Se verificó la lectura del QR en la captura y no se registraron errores o advertencias de consola.

## Ajustes de círculos y patrones — 19 de noviembre de 2026

- Slides 3 y 14: solo conservan los círculos verdes inferiores. Se añade otro grupo de círculos de 244 px, con el centro horizontal al 25% del ancho y opacidad del 20%, recortado en el borde superior. En teléfono mide 156 px y tiene opacidad del 16%. Se retiraron los alimentos de estas dos slides.
- Slide 4: se retiraron mantel, alimentos y textura, dejando el texto y la gráfica sobre su fondo.
- Slide 8: el mantel se sustituyó por un friso de alimentos delineados, generado con ImageGen y compuesto a baja opacidad sobre el fondo vino. Conserva la vajilla superior y el bodegón inferior. El patrón transparente se sirve en WebP adaptativo y las copias reutilizan el mismo recurso.
- Slide 9: se retiró el bodegón superior y se amplió el espacio entre el título y las cajas; sus arcos y colores se conservan.
- Slide 13: el adorno de limón y hojas se sustituyó por un fondo repetido de cítricos sin relleno. El vector usa un tono mostaza y baja opacidad para integrarse en el amarillo.

Los textos comerciales, las cifras, la demo y las animaciones mantienen su contenido y comportamiento. `PROMPTS.md` registra la nueva generación y el archivo vectorial.

Se comprobaron estas seis slides a 1280×720, 1440×900, 390×844 y 320×740: 24 vistas sin desbordamiento horizontal ni recortes verticales en escritorio. Los círculos superiores tienen su centro al 25% del ancho; la slide 4 no contiene adornos y la 9 deja aproximadamente 47 px entre el título y las cajas a 1280×720. El patrón de cítricos cargó correctamente. La entrada sigue siendo el demo y mantiene pendientes las imágenes de la presentación, incluidos ambos patrones. No hubo errores ni advertencias de consola.

## Composiciones de restaurante — Revisión del 19 de noviembre de 2026

La slide 7 presenta una mesa ovalada con tres platillos ilustrados, tres cartas de menú con inclinaciones y bordes distintos, y un mantel que atraviesa la base. La ilustración nueva tiene transparencia real, sin rectángulo de fondo ni desvanecido. La cabecera usa una cuadrícula: en teléfono, el texto y los platillos se acomodan debajo del título, y las cartas se apilan.

La slide 8 incorpora una franja amplia de mantel, un plato de cerámica en la esquina superior y un bodegón de tomate, limón y hojas. La 9 organiza sus tres ideas en arcos de colores con iconos centrados. La 16 conserva el mosaico como un marco definido en L, junto con cartas bordeadas y hojas sobre el remate. La 18 tiene un mantel que ocupa la parte inferior, tres propuestas con etiquetas de color y una composición vegetal superior. En las otras slides decoradas, los platos, hojas y cítricos se agrupan en composiciones mayores. El mosaico ya no se utiliza en la 7 y ningún mosaico lleva un desvanecido.

Se conservan las palabras de la presentación comercial, las cifras, el demo y las animaciones anteriores. La única estructura de contenido modificada en `app.js` es la cabecera de la slide 7 para alojar la imagen y adaptarla a móviles. Sus textos siguen iguales. Los adornos se recortan dentro de la slide y el óvalo acompaña a la ilustración al cambiar el tamaño. Los recursos modificados llevan una versión en sus referencias para evitar que el navegador mezcle archivos anteriores con los nuevos.

Se recorrieron las 19 slides a 1280×720 y 1440×900 sin desbordamientos. También se revisaron las 19 a 390×844 y 320×740 sin desplazamiento horizontal; las slides largas conservan su desplazamiento vertical. Se revisaron visualmente la mesa, el comedor, los tres arcos, el marco de mosaico y el piloto. Las transiciones de la 6 a la 7 y de la 11 a la 12 se completaron sin capas residuales; el QR de la captura sigue leyendo la URL del demo. La consola no registró errores ni advertencias. El navegador integrado sigue sin exponer pantalla completa; se conserva la limitación de comprobación descrita abajo.

## Superficies y movimiento — Primera revisión del 19 de noviembre de 2026

Se conservan el relato comercial, los datos y las funciones del demo. Las slides incorporan una textura ligera de papel, detalles de mantel en la 4, 8 y 18, mosaico de alimentos en la 7 y 16, y frutas, hojas o contornos de platos en otros márgenes. Las portadas mantienen sus ilustraciones. Las superficies se recortan dentro de una capa independiente para no crear desplazamientos horizontales ni tapar el contenido. En teléfonos, los adornos se reducen y las etiquetas de la slide 7 se colocan sobre el título de cada tarjeta.

Las tarjetas de las slides 7, 9 y 18, y los tres momentos de la 10, aparecen automáticamente uno a uno: 180 ms de separación y 420 ms de duración, completando la secuencia habitual en 780 ms. No requieren clics adicionales ni cambian de diapositiva por sí solas.

Al avanzar de la 6 a la 7, un círculo amarillo se expande hasta formar el fondo de la propuesta para negocios. De la 11 a la 12, el mismo recurso en azul abre la invitación al demo y su QR. Duran 620 ms; las tarjetas de la 7 terminan de aparecer dentro de 980 ms. Al retroceder o saltar por el índice se conserva el cambio sencillo. La navegación rápida, salir al demo, redimensionar o cambiar de pantalla completa cancelan el efecto y restauran las capas. La preferencia de reducir movimiento muestra el contenido completo de inmediato.

El mosaico se entrega en dos WebP adaptativos (640 y 960 px) y se carga solo cuando se abre su slide. Se comprobó que la entrada al demo mantiene cero imágenes de la presentación cargadas; los dos mosaicos permanecen pendientes. Los SVG y el mantel no requieren descargas adicionales. `PROMPTS.md` registra la imagen generada y su prompt.

Verificación de esta actualización: recorrido de las 19 slides a 1280×720 y 390×844 sin desbordamientos horizontales; ninguna slide desborda verticalmente en escritorio y las largas permiten desplazamiento en móvil. Revisión adicional de las tarjetas de la 7 a 320 px, sin superposición de etiqueta y título. Se probaron ambas transiciones en navegador y la navegación rápida sin capas residuales ni elementos bloqueados; el QR de la captura final conserva la URL correcta. No se registraron errores o advertencias de consola. Una prueba aislada verificó la preferencia de movimiento reducido, el final automático de las listas y la cancelación de transiciones anteriores. El navegador integrado de esta revisión no expone la API de pantalla completa: sus reglas previas se conservaron y el efecto se cancela al recibir ese cambio, pero la reproducción en pantalla completa debe comprobarse en el navegador de exposición.

## Ritmo de las slides 9, 10 y 18

Cada elemento de sus listas aparece durante 750 ms y el siguiente comienza al terminar el anterior. Los tres elementos completan su entrada en 2.25 segundos, automáticamente. La slide 7 y las transiciones circulares conservan sus tiempos. Se mantienen la cancelación al navegar y la preferencia de movimiento reducido.
