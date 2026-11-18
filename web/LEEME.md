# A domicilio — rediseño visual

Abre `index.html` junto con el resto de esta carpeta. La entrada principal es el demo. La presentación y su índice están dentro del botón de tres puntos, en la esquina inferior derecha. Las fuentes, imágenes y datos de respaldo están incluidos para no depender de internet.

En la presentación, el botón de expansión o F muestra solo la diapositiva. Usa las flechas para avanzar y F o Escape para salir. El recorrido actual, los controles y la verificación están en `FLUJO.md`.

La actualización de iconos incorpora 23 ilustraciones originales en SVG, con formas recortadas y la paleta de A domicilio. Sustituyen los pictogramas de comida y de apoyo en la presentación y la demo. Puedes ver la familia en `catalogo-iconos.html`; las fuentes editables, exportaciones y verificaciones están descritas en `ICONOS.md`.

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

- `img/platillos/` contiene 99 fotografías JPEG distintas, una para cada ID de restaurante de las recomendaciones actuales. Se exportaron a un lado largo máximo de 1200 px y calidad 82.
- `imagenes-platillos.js` mantiene la asociación estable. Cada lista de diez recomendaciones tiene diez fotos distintas; un mismo restaurante conserva su foto cuando aparece para varias personas.
- Tarjetas y fichas usan la misma asociación. Los datos, el orden de las recomendaciones y los resultados de evaluación no cambian.
- `img/portada-v2.png` corrige el agarre del tenedor de la mano de la portada. La presentación ahora usa esa versión; se conserva `img/portada.png`.
- `PROMPTS-galeria.md` documenta la generación integrada y la edición de la mano. `catalogo-imagenes.json` identifica productos, restaurantes, archivos y prompts.

Se revisaron visualmente las 99 fotografías en hojas de contacto y se comprobó su integridad JPEG, resolución, ausencia de archivos idénticos y cobertura de las doce listas. La galería ocupa aproximadamente 30 MB, con una media de 310 KB por fotografía. En navegador se comprobó la primera lista con diez URL de imagen distintas y la ficha del chawanmushi con su imagen específica. La revisión adicional del navegador se interrumpió al reiniciarse el entorno de herramientas; no se atribuye esa incidencia al sitio. Las capturas de versiones anteriores no se incluyen en el paquete actual para evitar confundirlas con esta galería.

## Doce personajes con identidad propia

La selección ahora muestra doce retratos individuales: Ale, Rubén, Tere, Niko, Sofi, Beto, Mar, Kari, Pau, Dani, Lupe y Chava. Las cuatro categorías muestran a sus tres integrantes. Se reutilizaron cuatro ilustraciones y se generaron ocho retratos nuevos, con rasgos, peinados y vestuario diferentes. Rubén, Beto, Dani y Chava tienen retratos masculinos propios.

`avatarPersona()` y `RETRATOS_PERSONAS` en `app.js` asocian cada nombre con un JPEG de `img/personas/`. La misma imagen acompaña al personaje en la selección, el perfil y la ficha del platillo. La diapositiva 12 muestra el elenco completo; el ejemplo de Ale conserva su retrato. `PROMPTS-personajes.md` registra las asociaciones y los prompts de generación.

Se revisaron visualmente los doce retratos y se verificaron doce archivos con hashes distintos. En navegador se recorrieron las doce selecciones, sus perfiles y la primera ficha de cada uno: todas conservaron el retrato correcto. Se comprobaron la selección y el perfil a 390 y 320 px, y la diapositiva del elenco a 1280×720, 1440×900 y 390×844, sin desbordamiento horizontal. Los retratos cargaron correctamente y no se registraron errores ni advertencias de consola. Los datos canónicos, las recomendaciones y los resultados no cambiaron.

## Flujo centrado en el demo

La entrada sigue siendo el demo, con la presentación y su índice en el menú inferior. La selección se restauró a la versión por categorías, tres personajes y vista previa; se conserva el perfil compacto al abrir la lista y sus cifras completas en Historial. La pantalla completa muestra únicamente la diapositiva.

Las tarjetas y fichas narran las recomendaciones en tercera persona mediante `razonPersonaje()`: por ejemplo, «Tere ha pedido en este restaurante 24 veces». Se verificaron los 120 motivos sin alterar los datos originales. `FLUJO.md` describe el recorrido y la revisión de esta corrección; las comprobaciones anteriores de este archivo corresponden a las iteraciones descritas en cada sección.

## Icono de la pestaña

`favicon.svg` reproduce el círculo rojo y la «a.» crema de la marca, con la letra convertida en trazos para no depender de fuentes instaladas. `favicon.ico` incluye tamaños de 16, 32, 48 y 64 px; `apple-touch-icon.png` ofrece una versión de 180 px. La página principal y el catálogo de iconos declaran estos recursos.
