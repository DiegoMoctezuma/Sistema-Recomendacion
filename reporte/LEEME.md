# Reporte final

`ProyectoFinal_MoctezumaRamirez.pdf` y `.docx`: reporte de Datos Masivos II, generado con las cifras de
`export/resultados.json`, `web/demo.json` y las figuras de `figs/`.

Para regenerarlo después de volver a correr el notebook o el demo:

```bash
cd reporte
npm install docx               # una sola vez
node build.js paginas.json     # escribe el .docx
soffice --headless --convert-to pdf ProyectoFinal_MoctezumaRamirez.docx
python3 paginas.py ProyectoFinal_MoctezumaRamirez.pdf   # actualiza los números del índice
node build.js paginas.json     # segunda pasada con el índice correcto, y volver a convertir
```

`assets/` contiene los escudos de la UNAM y de la FES Acatlán y las líneas de la portada.
