# Imágenes por generar — A domicilio

Nueve imágenes. Cada una tiene su **slug**, dónde va, el **prompt** listo para pegar y cuál
de las referencias de `Identidad/img/` debe acompañarlo.

**Cómo se instalan:** guarda cada archivo como `web/img/<slug>.png`. La página ya tiene el
hueco: en cuanto el archivo existe, aparece sola. Mientras no exista, se ve el recuadro
punteado con el encargo, así que nada se rompe.

## Reglas comunes para todos los prompts

Pega este bloque al final de cada prompt:

> Paleta estricta: jitomate #DC4033, naranja #E06129, mostaza #F9D949, lima #98C257,
> verde hoja #234525, cobalto #2E5193, betabel #BD2A6A, vino #521A1B, papel crema #FFFCDF,
> negro tinta #1C181A. Ilustración plana, sin degradados ni sombras suaves, con textura
> granulada de impresión (grain) sutil. Sin texto, sin letras, sin logotipos, sin marcas
> de agua. Composición centrada con aire alrededor. PNG con fondo transparente.

---

## 1. `scroll-infinito` · slide 2 "Diez minutos de scroll"

**Referencia:** `Screenshot 2026-09-21 at 10.57.56.png` (la app violeta y amarilla) y
`Screenshot 2026-09-21 at 10.56.34.png` (el mosaico de verduras).
**Proporción:** 4:3 horizontal, ~1600×1200.

> Ilustración vectorial plana de una persona joven vista de tres cuartos, sentada con el
> celular en las manos y cara de indecisión. Alrededor flotan ocho tarjetas rectangulares
> idénticas de restaurante, todas iguales entre sí, formando un remolino que gira alrededor
> de ella. Estilo geométrico de formas simples, como el mosaico de frutas y verduras de la
> referencia: círculos, medios círculos y rectángulos de color pleno. La ropa en jitomate y
> mostaza, el fondo transparente, las tarjetas en papel crema con borde negro tinta.

---

## 2. `fonda-sola` · slide 5 "Abriste hace un mes y no existes"

**Referencia:** `Screenshot 2026-09-21 at 10.56.43.png` (verduras con grano sobre fondo
verde oscuro). Esta va sobre fondo verde hoja, así que debe leerse en oscuro.
**Proporción:** 4:3 horizontal, ~1600×1200.

> Ilustración plana de tres locales en hilera vistos de frente. Los de los extremos están
> apagados, en verde hoja muy oscuro, con las cortinas abajo. El de en medio es un puesto de
> comida pequeño con la luz encendida: toldo a rayas en jitomate y papel crema, un foco
> amarillo mostaza que proyecta un cono de luz cálida sobre la banqueta, y vapor saliendo de
> una olla. Textura granulada visible. Pensada para colocarse sobre un fondo verde oscuro.

---

## 3. `ranking-tachado` · slide 6 "Mostrar los más pedidos"

**Referencia:** `Screenshot 2026-09-21 at 10.57.48.png` (el empaque Adesso, dibujo a línea
azul sobre papel).
**Proporción:** 1:1, ~1400×1400.

> Dibujo a mano alzada, a una sola tinta cobalto #2E5193 sobre fondo transparente, con trazo
> grueso y parejo de puntas redondeadas, al estilo de los dibujos del papel de envoltura de
> la referencia. Una lista de ocho renglones dentro de un marco, como un ranking: cada
> renglón es un platillo dibujado en miniatura (hamburguesa, taco, tazón de ramen, pizza,
> café, dona, ensalada, sándwich). Cinco de los ocho renglones están tachados con una línea
> diagonal firme, como corrección hecha a mano. Nada de texto: solo los dibujos y las tachas.

---

## 4. `tres-senales` · slide 9 "Lo que pides, quién come como tú, qué hay cerca"

**Referencia:** `Screenshot 2026-09-21 at 10.57.48.png` (línea a una tinta).
**Proporción:** 4:3 horizontal, ~1600×1200.

> Diagrama a una sola tinta negro tinta #1C181A sobre fondo transparente, trazo grueso de
> puntas redondeadas, estilo dibujo a mano. Tres símbolos a la izquierda, uno debajo del
> otro: un tazón con palillos, tres figuras humanas simples tomadas de la mano, y un pin de
> mapa. De cada uno sale una flecha curva hacia una caja cuadrada al centro. De la caja sale
> una flecha hacia la derecha que termina en una pila de tres tarjetas de restaurante
> apiladas con ligera rotación. Limpio, sin relleno de color, sin texto.

---

## 5. `entrega-fonda` · slide 15 "Cada punto que sube es una fonda que aparece"

**Referencia:** `Screenshot 2026-09-21 at 10.56.13.png` (Mister G's: manos y comida en
primer plano sobre fondo vino).
**Proporción:** 4:3 horizontal, ~1600×1200.

> Ilustración plana, primer plano de dos manos: una entrega una bolsa de papel de comida
> para llevar y la otra la recibe. La bolsa en papel crema con una banda en jitomate.
> Encuadre cerrado y recortado como la fotografía de la referencia, con las manos entrando
> desde los bordes. Piel resuelta en un tono plano cálido, sin detalle realista. Detrás, de
> forma muy simple, el mostrador de un local pequeño. Fondo transparente.

---

## 6–9. Los cuatro personajes de la demo

Van en los avatares redondos de la pestaña **Demo**. Son **cuatro**, uno por arquetipo, y se
reparten entre los doce clientes. Todas con la misma pose y encuadre para que se vean como
una familia.

**Referencia para las cuatro:** `Screenshot 2026-09-21 at 10.57.56.png` (el personaje
ilustrado de la app, plano, con formas 3D flotando) y la paleta de
`Screenshot 2026-09-21 at 10.56.34.png`.
**Proporción:** 1:1, ~900×900, el personaje de medio cuerpo centrado y recortado en círculo.

**Base común del prompt** (cambia solo la última frase):

> Retrato de medio cuerpo de un personaje ilustrado, estilo plano y geométrico, composición
> cuadrada pensada para recortarse en círculo. Fondo de color pleno sin degradado. Rasgos
> mínimos: dos puntos por ojos y una línea por boca. Cuerpo en formas simples. Un objeto
> flotando junto a la cabeza. Serie de cuatro personajes con el mismo encuadre y estilo.

| Slug | Personaje | Fondo | Frase final del prompt |
| --- | --- | --- | --- |
| `personaje-fiel` | El fiel | mostaza #F9D949 | *Persona tranquila y sonriente sosteniendo con las dos manos un tazón humeante que claramente es su favorito; junto a su cabeza flota una taza de café. Ropa en jitomate.* |
| `personaje-explorador` | El explorador | cobalto #2E5193 | *Persona con gesto curioso, inclinada hacia adelante, con una brújula hecha con un tenedor flotando junto a su cabeza y tres platillos distintos orbitando a su alrededor. Ropa en mostaza.* |
| `personaje-ocasional` | El ocasional | lima #98C257 | *Persona relajada, medio recargada, con una caja de comida para llevar en el regazo y un reloj flotando junto a su cabeza marcando el fin de semana. Ropa en cobalto.* |
| `personaje-nuevo` | Sin historial | naranja #E06129 | *Persona de espaldas que voltea apenas hacia el frente, estrenando la app: sostiene un celular con la pantalla vacía y junto a su cabeza flota un signo de interrogación. Ropa en papel crema.* |

---

## Opcional, si sobra tiempo

| Slug | Dónde | Qué sería |
| --- | --- | --- |
| `textura-papel` | fondo general | Escaneo de papel crema con fibra visible, para sustituir el grano generado por código |
| `marca-a` | portada | La letra **A** de la marca dibujada a mano, para reemplazar la tipográfica actual |

---

## Checklist de instalación

- [ ] `web/img/scroll-infinito.png`
- [ ] `web/img/fonda-sola.png`
- [ ] `web/img/ranking-tachado.png`
- [ ] `web/img/tres-senales.png`
- [ ] `web/img/entrega-fonda.png`
- [ ] `web/img/personaje-fiel.png`
- [ ] `web/img/personaje-explorador.png`
- [ ] `web/img/personaje-ocasional.png`
- [ ] `web/img/personaje-nuevo.png`

Cuando las tengas, avísame y las subo al sitio publicado.
