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

## Slide 6 — El ranking y el paso del tiempo

Generada el 19 de noviembre de 2026 con la herramienta integrada ImageGen, usando `img/entrega-fonda.webp` como referencia de estilo. Ilustración conceptual: el reloj de arena representa el tiempo; las tarjetas y el tazón sitúan la idea en la comida a domicilio. La cifra 8/20 se presenta como texto HTML, separado de la imagen.

Original PNG con transparencia guardado en `outputs/ilustracion-popularidad.png` dentro del espacio de trabajo. Para la web: `img/popularidad-tiempo.webp` (1536×1024, 227,156 bytes) e `img/popularidad-tiempo-960.webp` (960×640, 107,006 bytes), calidad 84 y alfa conservado.

Prompt exacto:

```text
Use case: illustration-story. Asset type: a presentation illustration for the food recommendation brand A domicilio. Create a NEW flat editorial cut-paper illustration. The attached image is a STYLE REFERENCE only: match its bold geometric paper shapes, subtle screenprint grain, cream/tomato red/forest green/mustard/cobalt palette and warm food-market feeling. Do not reuse the hands, bag or layout. Primary message: yesterday's popular food choices need to be evaluated again over time. Depict a large elegant mustard-yellow HOURGLASS with visible falling grains, a small overlapping stack of cream restaurant-menu cards behind it (only simple food illustrations and one small star, no writing), and a fresh inviting red-and-cream bowl of noodles with tomato and leafy herbs in the foreground. A lemon slice and two bold green leaves tie the scene together. One coherent still-life composition with the hourglass and food as clear focal points, readable at a distance. Landscape 3:2 framing, generous clean breathing room around every silhouette, every object entirely inside the image. Transparent background: this will sit directly on a deep cobalt slide; no painted backdrop, no rectangular panel, no fake checkerboard. Texture only inside the illustrated objects. Opaque paper-like shapes with crisp edges, no glass photorealism, no 3D, no photographic lighting, no drop shadows, no gradients. No people, no hands, no text, letters, numbers, logos, calendars with dates, closed restaurants, crosses or strikethroughs. The image is a conceptual illustration, not a chart, so do not show counts or data.
```
