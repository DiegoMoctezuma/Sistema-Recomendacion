# Imágenes optimizadas — 18 de noviembre de 2026

Las mismas imágenes se recodificaron a WebP y se adaptaron al tamaño en el que aparecen. Se conservaron los SVG, el favicon y el icono PNG para dispositivos Apple.

## Medición del inicio

Comparación con servidor HTTP local sin caché, a 390×844 píxeles y densidad 1×. Se sumaron los tamaños de los archivos solicitados al abrir el demo, antes de seleccionar persona o platillo:

| Recursos solicitados | Antes | Después | Reducción |
|---|---:|---:|---:|
| Imágenes del inicio | 11,370,921 bytes | 51,078 bytes | 99.55% |
| Página completa y recursos iniciales | 12,002,595 bytes | 684,489 bytes | 94.30% |

El total incluye lo que el navegador pidió en esa apertura, sin cabeceras HTTP. No equivale al tamaño de toda la carpeta ni a una medición de segundos con una conexión móvil real. El navegador puede escoger variantes mayores según pantalla y densidad; una visita con caché puede transferir menos datos.

## Archivos y tamaños

- **99 platillos:** versiones de 480, 800 y 1200 px. Las de 480 px pesan 23.9 KB de media, las de 800 px 61.8 KB y las de 1200 px 129.3 KB. Las tarjetas ofrecen 480/800 px; la ficha ofrece 800/1200 px.
- **12 retratos:** versiones de 192 y 480 px. La de 192 px pesa 4.3 KB de media. `sizes` indica el tamaño del retrato en su contexto.
- **4 ilustraciones de presentación:** versiones de 960 y 1536 px.
- **6 imágenes de respaldo por familia de comida:** versiones de 480, 800 y 1200 px para recomendaciones futuras sin foto individual.
- **347 WebP en total:** 22.86 MiB, incluyendo todas las variantes. Los 126 originales PNG/JPEG archivados ocupaban 67.11 MiB, una reducción del 65.9% en el conjunto de archivos de imagen.

Calidades de exportación: 76–80 para platillos; 80–82 para retratos; 82–84 para las ilustraciones. Los originales se conservaron en el respaldo de la carpeta del proyecto `web_respaldo_antes_webp_2026-11-18` —o su variante con hora—. La copia de trabajo conserva además `outputs/originales-imagenes/`, separada de la web entregable.

`rendimiento-imagenes.json` registra archivos, dimensiones, calidades, bytes y medición. `catalogo-imagenes.json` conserva la relación restaurante/producto/foto y añade las variantes WebP y la ruta original histórica. Las rutas PNG/JPEG mencionadas en los documentos de generación corresponden a los originales archivados.

## Carga en la web

- `srcset` y `sizes` permiten elegir la variante adecuada para cada tarjeta, retrato o ficha.
- Las fotos de tarjetas usan carga diferida nativa; la foto del platillo abierto se carga inmediatamente.
- La presentación conserva sus imágenes como `data-src` y `data-srcset` hasta activar su diapositiva. Abrir el demo no descarga las ilustraciones de presentación.
- Las imágenes reservan dimensiones y usan decodificación asíncrona. El diseño conserva sus proporciones.

## Verificación

Se verificó la integridad de los 347 WebP y sus dimensiones, las tres variantes de cada restaurante y las rutas generadas por los mapas. Se comparó la apertura antes/después con registros de solicitudes HTTP sin caché. En navegador se revisaron la selección móvil, las tarjetas de Ale y su ficha: las tarjetas visibles usaron 480 px, las que quedaban lejos no descargaron sus imágenes todavía y la ficha usó 800 px. Las imágenes de la presentación no se descargaron en el inicio del demo. Se recorrieron las 19 diapositivas a 1280×720 y se comprobó la carga de sus imágenes, incluido el elenco y el ejemplo de Ale. No hubo errores ni advertencias de consola.

Esta actualización conserva los datos canónicos, la selección por categorías, los textos en tercera persona y los controles de presentación. La revisión visual se hizo mediante HTTP local; se conserva el respaldo de datos para apertura directa de archivos.
