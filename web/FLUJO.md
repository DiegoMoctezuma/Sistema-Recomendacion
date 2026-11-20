# Recorrido del demo y modo de presentación

## Recorrido comercial — 20 de noviembre de 2026

Se conservan las cuatro categorías, las doce identidades y sus retratos: Ale, Rubén, Tere, Niko, Sofi, Beto, Mar, Kari, Pau, Dani, Lupe y Chava. La selección mantiene categorías, tres integrantes y vista previa. Las asociaciones entre nombre e imagen y los datos de los personajes siguen iguales.

Después de elegir se abre **Su menú**, con sus diez restaurantes en el orden original. Cada tarjeta muestra la foto ilustrativa, el platillo que identifica al lugar, si ya lo conoce o está por descubrir y una razón breve sobre ese personaje. La foto y «Por qué aparece para…» abren la ficha. Las zonas e identificadores se consultan dentro de sus datos desplegables.

La ficha da prioridad a «¿Por qué aparece para…?», los pedidos anteriores y las cocinas observadas. Permite guardar para el personaje, avanzar al platillo anterior o siguiente y cerrar con botón, Escape o Atrás. El indicador porcentual conserva la escala ilustrativa por posición, con su aclaración, y se coloca después de los motivos y del botón para guardar. No se muestra como puntuación principal en las tarjetas. «Datos de esta recomendación» conserva el porcentaje de aporte, la zona, los pedidos en entrenamiento y el cálculo del indicador.

**Su historia** reúne sus lugares más pedidos y cocinas principales. Se presenta como un resumen, sin inventar una secuencia de fechas. Los casos sin pedidos previos explican que sus gustos todavía están por conocerse y que sus sugerencias empiezan por popularidad reciente. Las descripciones visibles de Kari y de quienes empiezan usan los datos actuales y un lenguaje cotidiano.

**Qué eligió después** cuenta el desenlace en tercera persona y conserva todos los resultados. Por ejemplo, Ale mantiene una coincidencia entre tres lugares posteriores; los casos con cero coincidencias también se muestran. Los lugares observados indican cuáles ya estaban en el menú. La muestra comparativa del grupo queda en «Qué pasó en historias parecidas». Se mantiene visible que las personas no vieron las listas y que la comparación no demuestra cambios en decisiones ni ventas.

Las rutas existentes (`recomendaciones`, `historial`, `resultado` y `platillo`) mantienen sus claves, aunque las pestañas tengan nombres nuevos. Se conserva el regreso a la persona seleccionada y su posición, los favoritos locales, los enlaces directos y Atrás/Adelante. Las entradas duran 220–260 ms; la selección por categoría conserva su desplazamiento suave e interrumpible. Se respeta la preferencia de movimiento reducido.

`demo-relato.css` se carga después de las hojas existentes y limita sus cambios al demo y a su ficha. Reutiliza el patrón vectorial de cítricos en una cabecera, círculos discretos en el perfil y colores de papel en las tarjetas. No añade fotografías, cambia retratos ni modifica las slides o sus tiempos.

Verificación: doce recorridos de menú, historia y desenlace, con diez recomendaciones y resultados idénticos a los datos originales; doce fichas con retrato y nombre correctos; 120 motivos en tercera persona sin lenguaje técnico en el texto principal. Se comprobaron favoritos al recargar, platillos anterior/siguiente, cierre de ficha, pestañas por teclado, Atrás y Adelante, así como selección, menú, historia, resultado y ficha larga a 320 px, además de las vistas a 390 y 768 px. Las vistas revisadas no presentan desplazamiento horizontal. Las secciones siguientes documentan revisiones anteriores.

La apertura sin ruta entra en `#demo`. El HTML también muestra el demo por defecto. La presentación permanece en el menú inferior; las rutas directas a una persona, platillo o diapositiva siguen funcionando.

## Selección restaurada

1. **Elegir una forma de pedir:** cuatro tarjetas ilustradas muestran las categorías y sus tres integrantes.
2. **Conocer al personaje:** al escoger la categoría aparece la selección de sus tres personas. Tocar una persona actualiza su vista previa, sus gustos y su hora típica.
3. **Entrar a su lista:** «Ver la lista de…» abre las diez recomendaciones del personaje elegido.
4. **Explorar:** cada platillo abre su ficha. Las pestañas Recomendaciones, Historial y Resultado permiten entender la lista y comprobar qué ocurrió después.
5. **Cambiar persona:** vuelve a la categoría y persona seleccionadas; se conservan el desplazamiento de la selección durante el recorrido y el foco. Atrás del navegador también funciona.

La selección por categorías, personajes y vista previa se recuperó a petición del usuario. Se conserva la cabecera compacta del menú recomendado y las cifras detalladas en Historial.

## Redacción sobre el personaje

`razonPersonaje(g,r)` en `demo.js` adapta los motivos exportados para mostrarlos en tercera persona. La misma función se utiliza en las tarjetas y las fichas; no modifica `demo.json` ni sus cifras.

- Repetición: «Tere ha pedido en este restaurante 24 veces»; se respeta el singular «1 vez».
- Conexiones: «Tere recibe esta sugerencia por una conexión con…».
- Popularidad: «Dani recibe esta sugerencia porque el restaurante está entre los más pedidos de las últimas dos semanas».
- Contexto de cocina: «Tere tiene 24 pedidos previos en la categoría “Arroz con pollo”».

Los mensajes de favoritos también identifican al personaje. Las instrucciones de navegación, como elegir o abrir un platillo, siguen dirigiéndose a quien opera el demo.

## Material del proyecto y presentación

El botón de tres puntos en la esquina inferior derecha abre «El proyecto». Ahí están el regreso al demo, la presentación y su índice, inicialmente plegado. No hay una barra superior de navegación ni un selector permanente de presentación/demo.

La marca A domicilio lleva a elegir personaje. Los enlaces de entrada a la demo y del ejemplo de Ale dentro de la presentación conservan su comportamiento.

Fuera de pantalla completa, las flechas y el botón de expansión están en la franja inferior. El botón de expansión o **F** lleva a pantalla completa exclusivamente a la diapositiva: no aparecen el menú, la franja de controles, el número y la descripción externos ni el folio de la esquina. **← / →**, **Re Pág / Av Pág**, **Inicio / Fin** y el gesto horizontal permiten recorrerla. **F** o **Escape** salen de pantalla completa. F se activa únicamente en la presentación.

`flujo.css` conserva el menú secundario, el perfil compacto y la pantalla completa. El diseño de selección recuperado está en `demo.css`. `app.js` controla las rutas principales y la presentación; `demo.js` controla las categorías, las personas, las pestañas y las fichas.

## Verificación de esta corrección

Se verificaron los 120 motivos de las doce personas: 67 de repetición, 23 de conexiones y 30 de popularidad. Todos identifican al personaje; no contienen las expresiones en segunda persona del exportador y las cantidades de repetición se conservan. Tarjetas y fichas comparten la función de redacción.

En navegador se revisaron las cuatro categorías, la vista previa de Sofi, el caso de Tere con 24 pedidos, una conexión de su lista y el caso de Dani sin historial. La selección y las fichas se comprobaron a 390 y 320 px, sin desbordamiento horizontal en las vistas revisadas. También se probó el regreso a la selección mediante Atrás y no hubo errores ni advertencias de consola.

La entrada principal, el menú secundario y la pantalla completa se conservaron de la versión anterior, en la que se recorrieron las 19 diapositivas a 1440×900 y se comprobaron las salidas con F y Escape. La apertura `file://` conserva los recursos locales; la revisión visual se hizo mediante servidor HTTP local.
