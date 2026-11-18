# Retratos individuales — A domicilio

Fecha: 17 de noviembre de 2026.

La demo contiene doce perfiles del dataset. Los nombres y retratos son ficticios. Se conservaron cuatro ilustraciones existentes y se generaron ocho nuevas con la herramienta integrada ImageGen, una llamada independiente por personaje, usando `img/personaje-fiel.png` como referencia visual de estilo. Cada archivo es un retrato individual, exportado a JPEG con lado máximo de 900 px y calidad 88.

La asociación por nombre está centralizada en `RETRATOS_PERSONAS` y `avatarPersona()` en `app.js`; se comparte entre presentación, categorías, selección, perfil y detalle de platillo.

| Nombre | Archivo | Origen |
|---|---|---|
| Ale | `img/personas/ale.jpg` | Ilustración existente: `img/personaje-fiel.png` |
| Rubén | `img/personas/ruben.jpg` | Nueva generación individual |
| Tere | `img/personas/tere.jpg` | Nueva generación individual |
| Niko | `img/personas/niko.jpg` | Ilustración existente: `img/personaje-explorador.png` |
| Sofi | `img/personas/sofi.jpg` | Nueva generación individual |
| Beto | `img/personas/beto.jpg` | Nueva generación individual |
| Mar | `img/personas/mar.jpg` | Ilustración existente: `img/personaje-ocasional.png` |
| Kari | `img/personas/kari.jpg` | Nueva generación individual |
| Pau | `img/personas/pau.jpg` | Nueva generación individual |
| Dani | `img/personas/dani.jpg` | Nueva generación individual |
| Lupe | `img/personas/lupe.jpg` | Ilustración existente: `img/personaje-nuevo.png` |
| Chava | `img/personas/chava.jpg` | Nueva generación individual |

## Prompts exactos de las ocho imágenes nuevas

Modo: ilustración con referencia de estilo; fondo opaco; una persona por imagen. Los archivos originales de las cuatro ilustraciones previas se conservan en `img/`.

### Rubén

Referencia: `img/personaje-fiel.png`.

```text
Use case: illustration-story. Create ONE new, distinct fictional character portrait for the A domicilio food recommendation demo. The attached image is a STYLE reference only: match its flat geometric cut-paper shapes, friendly minimal face, subtle screenprint grain, warm cream/tomato/cobalt/forest-green brand palette, and polished editorial illustration. Do not copy the reference person's identity or hairstyle. Square 1:1 image, centered chest-up portrait, fully opaque solid-color background. Leave generous breathing room around the head so a circular crop preserves the entire face. Natural simplified anatomy and relaxed hands. No text, letters, logos, watermark, extra people, photorealism or 3D. Character: An adult MAN, about forty, warm tan skin, short dark hair, neat short beard and moustache, friendly relaxed smile, forest-green sweater over a cream shirt, holding a small favorite coffee cup near the bottom of the frame. Solid golden yellow #F4CF48 background.
```

### Tere

Referencia: `img/personaje-fiel.png`.

```text
Use case: illustration-story. Create ONE new, distinct fictional character portrait for the A domicilio food recommendation demo. The attached image is a STYLE reference only: match its flat geometric cut-paper shapes, friendly minimal face, subtle screenprint grain, warm cream/tomato/cobalt/forest-green brand palette, and polished editorial illustration. Do not copy the reference person's identity or hairstyle. Square 1:1 image, centered chest-up portrait, fully opaque solid-color background. Leave generous breathing room around the head so a circular crop preserves the entire face. Natural simplified anatomy and relaxed hands. No text, letters, logos, watermark, extra people, photorealism or 3D. Character: An adult WOMAN, about fifty-five, warm medium skin, short wavy gray hair, large round coral-red glasses, kind smile, cream blouse with a dark-green collar, holding a simple favorite rice bowl near the bottom of the frame. Solid golden yellow #F4CF48 background.
```

### Sofi

Referencia: `img/personaje-fiel.png`.

```text
Use case: illustration-story. Create ONE new, distinct fictional character portrait for the A domicilio food recommendation demo. The attached image is a STYLE reference only: match its flat geometric cut-paper shapes, friendly minimal face, subtle screenprint grain, warm cream/tomato/cobalt/forest-green brand palette, and polished editorial illustration. Do not copy the reference person's identity or hairstyle. Square 1:1 image, centered chest-up portrait, fully opaque solid-color background. Leave generous breathing room around the head so a circular crop preserves the entire face. Natural simplified anatomy and relaxed hands. No text, letters, logos, watermark, extra people, photorealism or 3D. Character: A young adult WOMAN, warm tan skin, dark hair in a high braided bun, a simple green headband, curious bright expression, golden-yellow jacket over a cream top, holding a small interesting food bowl near the bottom of the frame. Distinct from the reference woman. Solid cobalt blue #264A8C background.
```

### Beto

Referencia: `img/personaje-fiel.png`.

```text
Use case: illustration-story. Create ONE new, distinct fictional character portrait for the A domicilio food recommendation demo. The attached image is a STYLE reference only: match its flat geometric cut-paper shapes, friendly minimal face, subtle screenprint grain, warm cream/tomato/cobalt/forest-green brand palette, and polished editorial illustration. Do not copy the reference person's identity or hairstyle. Square 1:1 image, centered chest-up portrait, fully opaque solid-color background. Leave generous breathing room around the head so a circular crop preserves the entire face. Natural simplified anatomy and relaxed hands. No text, letters, logos, watermark, extra people, photorealism or 3D. Character: An adult MAN, deep brown skin, very short cropped dark hair, neatly trimmed short beard, confident cheerful smile, tomato-red shirt with a cream collar, holding a small folded map with only simple paths and dots, no writing. Solid cobalt blue #264A8C background.
```

### Kari

Referencia: `img/personaje-fiel.png`.

```text
Use case: illustration-story. Create ONE new, distinct fictional character portrait for the A domicilio food recommendation demo. The attached image is a STYLE reference only: match its flat geometric cut-paper shapes, friendly minimal face, subtle screenprint grain, warm cream/tomato/cobalt/forest-green brand palette, and polished editorial illustration. Do not copy the reference person's identity or hairstyle. Square 1:1 image, centered chest-up portrait, fully opaque solid-color background. Leave generous breathing room around the head so a circular crop preserves the entire face. Natural simplified anatomy and relaxed hands. No text, letters, logos, watermark, extra people, photorealism or 3D. Character: An adult WOMAN, light warm skin, long black hair in one braid over a shoulder, round cream-colored glasses, relaxed slightly shy smile, cobalt-blue sweatshirt, holding a simple closed cream takeaway box. Distinctive braid and spectacles. Solid lime green #B2CF64 background.
```

### Pau

Referencia: `img/personaje-fiel.png`.

```text
Use case: illustration-story. Create ONE new, distinct fictional character portrait for the A domicilio food recommendation demo. The attached image is a STYLE reference only: match its flat geometric cut-paper shapes, friendly minimal face, subtle screenprint grain, warm cream/tomato/cobalt/forest-green brand palette, and polished editorial illustration. Do not copy the reference person's identity or hairstyle. Square 1:1 image, centered chest-up portrait, fully opaque solid-color background. Leave generous breathing room around the head so a circular crop preserves the entire face. Natural simplified anatomy and relaxed hands. No text, letters, logos, watermark, extra people, photorealism or 3D. Character: An adult WOMAN, deep brown skin, short tight curly hair, small round cream earrings, wide friendly smile, cream shirt with a forest-green cardigan, holding a simple small takeaway bowl. Distinctive short curly hairstyle and face. Solid lime green #B2CF64 background.
```

### Dani

Referencia: `img/personaje-fiel.png`.

```text
Use case: illustration-story. Create ONE new, distinct fictional character portrait for the A domicilio food recommendation demo. The attached image is a STYLE reference only: match its flat geometric cut-paper shapes, friendly minimal face, subtle screenprint grain, warm cream/tomato/cobalt/forest-green brand palette, and polished editorial illustration. Do not copy the reference person's identity or hairstyle. Square 1:1 image, centered chest-up portrait, fully opaque solid-color background. Leave generous breathing room around the head so a circular crop preserves the entire face. Natural simplified anatomy and relaxed hands. No text, letters, logos, watermark, extra people, photorealism or 3D. Character: A young adult MAN, warm medium skin, short wavy black hair, clean-shaven face, curious friendly smile, cream hoodie with a cobalt-blue collar detail, holding a forest-green smartphone with a completely blank cream screen. Clearly a different person from all other portraits. Solid orange #E76A32 background.
```

### Chava

Referencia: `img/personaje-fiel.png`.

```text
Use case: illustration-story. Create ONE new, distinct fictional character portrait for the A domicilio food recommendation demo. The attached image is a STYLE reference only: match its flat geometric cut-paper shapes, friendly minimal face, subtle screenprint grain, warm cream/tomato/cobalt/forest-green brand palette, and polished editorial illustration. Do not copy the reference person's identity or hairstyle. Square 1:1 image, centered chest-up portrait, fully opaque solid-color background. Leave generous breathing room around the head so a circular crop preserves the entire face. Natural simplified anatomy and relaxed hands. No text, letters, logos, watermark, extra people, photorealism or 3D. Character: An adult MAN, about forty-five, warm brown skin, wavy salt-and-pepper hair, short goatee, rounded cobalt glasses, broad welcoming smile, forest-green jacket over a cream shirt, holding a small smartphone with a blank cream screen. Distinctive glasses, goatee and gray hair. Solid orange #E76A32 background.
```
