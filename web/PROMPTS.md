# Imágenes generadas

Modo: herramienta integrada de generación de imágenes (sin CLI/API). Todas se generaron con una hoja de contacto de `Identidad/img/` como referencia de estilo. Los archivos finales están en `img/`, sin modificaciones de los originales de Identidad. Ocho recursos PNG, sin texto ni marcas.

## Prompt común de las cuatro ilustraciones

Use case: illustration-story. Create one finished editorial illustration for a Spanish food recommendation project A domicilio. Input image is STYLE REFERENCE ONLY: take the flat geometric vegetables, artisanal food packaging and bold screenprint aesthetic, do not reproduce brands or interface screenshots. Strict palette cream #FFF8E5, tomato #C73526, golden yellow #F4CF48, cobalt #264A8C, dark green #173E2E, orange #E76A32, burgundy #511D28. Hand-cut geometric shapes with subtle tactile screenprint grain, sophisticated playful composition, crisp silhouettes, no gradients, no photorealism. No text, letters, logos or watermarks.

A ese prompt se añadió el bloque correspondiente:

### img/portada.png

Wide 3:2 composition for the right half of an editorial cover. An overhead abundant table of food: giant tomato, lemon slice, leafy greens, bowl of noodles with chopsticks, small rice bowl, stylized hand reaching with a fork. Tightly composed interlocking shapes like the produce mosaic reference. Strong dark green background, cream and tomato and golden yellow objects, thin cobalt details. Image must fill every edge; no border. Keep the picture simple enough to read from across a classroom.

### img/scroll-infinito.png

Wide 3:2 scene: indecisive young adult in tomato sweater sitting on a cobalt stool, holding a phone, surrounded by six floating restaurant cards which repeat the same bowl and plate symbols. Face expressive, head tilted. Exaggerated graphic proportions, big shapes, attractive editorial drawing. Entire scene on warm cream #FFF8E5 background. No words on cards. Leave ample room around silhouette.

### img/fonda-sola.png

Wide 3:2 editorial scene of one charming little neighborhood restaurant seen frontally, with a red and cream striped awning, a golden glowing window, a big cooking pot with graphic curling steam, potted greens and two stools. Closed dark neighboring storefronts on each edge. Deep dark green #173E2E background. Central warm restaurant is the clear focal point; optimistic dignified small business, no people, no sign text. Flat screenprint light shapes only; no gradients.

### img/entrega-fonda.png

Wide 3:2 close-up editorial scene of two stylized warm skin-tone hands, one passing a cream paper takeaway food bag to the other. Bag has tomato-red stripe and a simple bold dark green bowl icon, no lettering. Arms enter from opposite sides. Oversized graphic food ingredients lemon tomato and leaves frame the top and bottom corners, like the food packaging references. Burgundy #511D28 background. Elegant simple composition, tactile screenprint texture.

## Prompt común de los cuatro personajes

Use case: illustration-story. One square editorial avatar for A domicilio food recommendation demo, a friendly geometric half-body character with minimal face, bold cut-paper shapes, subtle screenprint grain. Match the attached style reference's flat produce graphics and playful editorial illustrations. Strict food-market palette cream #FFF8E5, tomato #C73526, golden yellow #F4CF48, cobalt #264A8C, dark green #173E2E, burgundy #511D28. Center bust, generous space around head for round crop. No text, letters, logo or watermark.

A ese prompt se añadió el bloque correspondiente:

### img/personaje-fiel.png

A warm friendly woman with dark curly hair, tomato sweater, holding a favorite steaming cream bowl with both hands, golden yellow background.

### img/personaje-explorador.png

A curious young man with dark hair and round spectacles, golden yellow shirt, holding a fork like a compass; one small illustrated noodle bowl floats near his shoulder. Cobalt blue background.

### img/personaje-ocasional.png

A relaxed woman with short dark hair, cobalt blue sweater, holding a cream takeaway box, leafy lime green background.

### img/personaje-nuevo.png

A young adult with dark wavy hair, cream shirt, holding a phone showing a simple empty cream rectangle; tomato orange background.

## Friso de alimentos — Slide 8

Generado el 19 de noviembre de 2026 con ImageGen integrado, modo predeterminado y transparencia. La imagen adjunta del usuario aporta la idea de un friso de alimentos delineados. Se pidió un dibujo nuevo de alimentos reconocibles con trazos crema y textura de impresión, para repetirlo a baja opacidad sobre el fondo vino.

Original: `/Users/mikitl/Documents/Codex/2026-11-17/es-2/outputs/patron-comida.png` (1536×1024, alfa conservado). Variantes de la web: `img/patron-comida.webp` (960×640, 147,978 bytes) y `img/patron-comida-640.webp` (640×427, 75,592 bytes), calidad 82. El mismo archivo se reutiliza en el friso y solo carga al abrir la slide 8.

Prompt exacto:

```text
Use case: illustration-story. Generate one sophisticated repeating-pattern tile for the food recommendation brand A domicilio. The attached image is a LAYOUT AND INTENT REFERENCE ONLY: a quiet restaurant frieze formed from repeated food outlines. Improve its drawing substantially; do not copy its crude symbols, lettering or brown background. Create warm cream monochrome OUTLINE drawings of recognizable cut lemon slices, whole tomatoes with calyx, wavy noodle bowls, small bread loaves, olive branches and aubergines. The aesthetic is the brand's geometric cut-paper restaurant illustrations translated to refined hand-drawn contour art: bold simple food silhouettes, slightly irregular confident linework, subtle screenprint texture inside strokes. Each motif is a complete clear silhouette with generous space between motifs, similar line weight and optical size. Arrange in three staggered rhythmic rows across a landscape 3:2 tile. Alternate motifs and orientations so the pattern feels designed and lively; do not arrange them in individual cards or circles. Seamless repeat intent with a calm even density, visually aligned opposite edges. All outlines use the single color warm cream #fff8e5 with no colored fills. Genuine transparent background in every gap and inside every contour. No painted background, no wine or brown backdrop, no gradient, no fade, no rectangle, no frame, no shadows or glow. No people, hands, text, letters, numbers, logos, decorative writing or watermark. The result will be repeated at low opacity over a dark wine slide, so keep it graphic and crisp.
```

El patrón de la slide 13 se dibujó directamente como vector en `img/patron-citricos.svg`: limones enteros y rodajas, sin relleno, con trazos mostaza y repetición. Su color y baja opacidad se adaptan al fondo amarillo. No utiliza generación de imagen ni incorpora alimentos distintos a cítricos.

## Mesa de distintos gustos — Nueva composición de la slide 7

Generada el 19 de noviembre de 2026 con ImageGen integrado, modo predeterminado, con transparencia. La imagen de referencia `img/entrega-fonda.webp` solo aporta el estilo. Los tres platillos representan gustos distintos y no son fotos de pedidos concretos. La mesa verde, las cartas y el mantel se componen en HTML/CSS alrededor de la ilustración.

Original conservado en `/Users/mikitl/Documents/Codex/2026-11-17/es-2/outputs/mesa-gustos.png` (1536×1024, canal alfa conservado). Archivos para la web: `img/mesa-gustos.webp` (960×640, 173,492 bytes) y `img/mesa-gustos-640.webp` (640×427, 89,510 bytes), calidad 83. Se cargan al abrir la slide 7.

Prompt exacto:

```text
Use case: illustration-story. Create a new editorial food illustration for A domicilio. The reference image supplies STYLE ONLY: bold cut-paper shapes, warm screenprint grain, cream, tomato red, deep forest green, mustard yellow and cobalt blue. Subject: three different inviting dishes seen FROM DIRECTLY OVERHEAD, arranged as a loose triangular still life, one large cream-and-cobalt rimmed plate at lower center filled with rice, sliced grilled chicken, red tomato wedges and leafy herbs; one smaller deep-red bowl at upper left filled with golden curly noodles and herbs; one smaller cream-and-green bowl at upper right filled with colorful leafy vegetables, cucumber and radish. A few separate olive leaves, two olives and a lemon wedge nestle between dishes to make one cohesive composition. Graphic irregular handmade ceramic rims, flat food shapes with detailed subtle grain, no photographic shading. The three dishes are visually distinct and all wholly inside the frame with generous clean space around their silhouettes. Wide landscape 3:2 composition. IMPORTANT: genuine transparent background everywhere around the objects and in their gaps. No tabletop, no backdrop, no rectangle, no vignette, no gradient fade, no checkerboard, no glow, no shadows outside the shapes. This cutout will be placed over a green oval tabletop drawn in CSS. No people, no hands, no utensils, no letters, no text, no numbers, no logos. Keep the look sophisticated, warm and very legible at small slide sizes.
```

## Mosaico de mercado — Generación original, ahora en la slide 16

Generado el 19 de noviembre de 2026 con ImageGen integrado (modo predeterminado, sin CLI). Referencia de estilo: `img/entrega-fonda.webp`. Es una superficie decorativa nueva de inspiración romana; no representa información ni un mosaico histórico real.

Original opaco: `/Users/mikitl/Documents/Codex/2026-11-17/es-2/outputs/mosaico-mercado.png` (1536×1024). Variantes de la web: `img/mosaico-mercado.webp` (960×640, 182,086 bytes) e `img/mosaico-mercado-640.webp` (640×427, 92,280 bytes), calidad 68. Solo se cargan al abrir las slides correspondientes. El mantel se dibuja con CSS; las frutas y hojas de los márgenes son SVG originales integrados en `ambiente-slides.js`.

Prompt exacto:

```text
Use case: illustration-story. Asset: decorative food mosaic texture for the A domicilio presentation. Create one beautiful flat ROMAN-INSPIRED MOSAIC of fruits and vegetables, not a photograph of an archaeological site. Use the reference only for its warm cream, tomato red, forest green, mustard and cobalt palette and the geometric food shapes. Make a repeating-feeling all-over composition of lemon slices, whole tomatoes, olives and big simple leaves, constructed from tiny irregular square ceramic tesserae separated by fine warm-cream grout. Clear food silhouettes at a distance, small handcrafted tile variation close up. Cream ground, bright but restrained colors, an occasional simple cobalt geometric border motif. Even soft flat illumination, rich tactile ceramic grain, no shiny reflection, no deep relief, no dramatic shadows, no gradient. Fill the entire landscape 3:2 frame with the mosaic, no tabletop, frame, signage, letters, text, numbers, logos, hands or people. This is an abstract brand surface for use in cropped slide margins, with no information or text to interpret. Crisp well-defined shapes and a calm Mediterranean restaurant feeling.
```

## Slide 6 — El ranking y el paso del tiempo

Generada el 19 de noviembre de 2026 con la herramienta integrada ImageGen, usando `img/entrega-fonda.webp` como referencia de estilo. Ilustración conceptual: el reloj de arena representa el tiempo; las tarjetas y el tazón sitúan la idea en la comida a domicilio. La cifra 8/20 se presenta como texto HTML, separado de la imagen.

Original PNG con transparencia guardado en `outputs/ilustracion-popularidad.png` dentro del espacio de trabajo. Para la web: `img/popularidad-tiempo.webp` (1536×1024, 227,156 bytes) e `img/popularidad-tiempo-960.webp` (960×640, 107,006 bytes), calidad 84 y alfa conservado.

Prompt exacto:

```text
Use case: illustration-story. Asset type: a presentation illustration for the food recommendation brand A domicilio. Create a NEW flat editorial cut-paper illustration. The attached image is a STYLE REFERENCE only: match its bold geometric paper shapes, subtle screenprint grain, cream/tomato red/forest green/mustard/cobalt palette and warm food-market feeling. Do not reuse the hands, bag or layout. Primary message: yesterday's popular food choices need to be evaluated again over time. Depict a large elegant mustard-yellow HOURGLASS with visible falling grains, a small overlapping stack of cream restaurant-menu cards behind it (only simple food illustrations and one small star, no writing), and a fresh inviting red-and-cream bowl of noodles with tomato and leafy herbs in the foreground. A lemon slice and two bold green leaves tie the scene together. One coherent still-life composition with the hourglass and food as clear focal points, readable at a distance. Landscape 3:2 framing, generous clean breathing room around every silhouette, every object entirely inside the image. Transparent background: this will sit directly on a deep cobalt slide; no painted backdrop, no rectangular panel, no fake checkerboard. Texture only inside the illustrated objects. Opaque paper-like shapes with crisp edges, no glass photorealism, no 3D, no photographic lighting, no drop shadows, no gradients. No people, no hands, no text, letters, numbers, logos, calendars with dates, closed restaurants, crosses or strikethroughs. The image is a conceptual illustration, not a chart, so do not show counts or data.
```
