# Iconos ilustrados de A domicilio

Familia original de **23 SVG**: veinte ilustraciones de comida y tres de historial, conexiones y zona. Se dibujaron con formas vectoriales editables, sin librerías de iconos ni imágenes remotas.

La dirección visual toma las formas recortadas y los colores de las referencias de `Identidad/img/`: verde hoja, jitomate, cobalto, mostaza y crema. Se sustituyeron los pictogramas de línea por siluetas rellenas y detalles de alimentos. Café, té, boba, fideos, sushi, dumplings, curry y otras familias tienen diseños distintos. Los iconos de apoyo representan un recibo, conexiones entre alimentos y un mapa con un marcador vegetal.

## Archivos y edición

- `iconos.js` es la fuente de los dibujos, la paleta y la asociación entre cocina e ilustración. Se carga antes de `app.js` y `demo.js`, sin peticiones adicionales al pintar los SVG.
- `img/iconos/*.svg` contiene los 23 dibujos exportados para reutilizarlos en otros materiales.
- `catalogo-iconos.html` permite revisar la familia completa; se abre junto a la carpeta `fonts/`.
- `exportar_iconos.cjs` renueva los SVG y el catálogo después de editar `iconos.js`: ejecuta `node exportar_iconos.cjs` en esta carpeta. No necesita dependencias.

Los SVG en la app son decorativos, con `aria-hidden="true"`, porque sus etiquetas se muestran como texto junto a ellos. Los archivos independientes incluyen un nombre accesible. Las ilustraciones representan familias de cocina, sin pretender describir los ingredientes de cada producto.

## Integración y verificación

La misma familia aparece en el historial, los pedidos observados, los motivos de recomendación, el estado sin historial y la diapositiva sobre señales de recomendación. Los controles de navegación conservan sus símbolos y sus etiquetas.

Se revisaron los 23 dibujos en el catálogo y su integración en la diapositiva 9, el historial de Rubén y la ficha de un platillo. Se comprobaron las vistas de historial y ficha a 390 y 320 px, sin desbordamiento horizontal. No se registraron errores ni advertencias de consola. Se verificaron sintaxis, integridad XML de los SVG exportados y cobertura de las cocinas presentes en la demo. Los datos, personajes, orden de recomendaciones y métricas se conservan.
