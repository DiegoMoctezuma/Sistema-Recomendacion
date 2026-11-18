# Recorrido del demo y modo de presentación

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
