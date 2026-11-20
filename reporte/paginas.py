import subprocess, json, sys
pdf = sys.argv[1]
n = int([l for l in subprocess.check_output(['pdfinfo', pdf], text=True).splitlines() if l.startswith('Pages')][0].split()[-1])
titulos = ["1. Objetivo","2. Marco Teórico","3. Hipótesis","4. Desarrollo","5. Resultados","6. Conclusiones","7. Referencias","Anexo A — Código clave","Anexo B — Experimento negativo: híbrido calibrado"]
claves = {"4. Desarrollo":"4. Desarrollo (Metodología)"}
out = {}
for p in range(3, n + 1):
    txt = subprocess.check_output(['pdftotext', '-f', str(p), '-l', str(p), '-layout', pdf, '-'], text=True)
    lineas = [l.strip() for l in txt.splitlines()]
    for t in titulos:
        k = claves.get(t, t)
        if k not in out and any(l == t for l in lineas):
            out[k] = p
json.dump(out, open('paginas.json', 'w'), ensure_ascii=False)
print(out)
