"""Regenera el respaldo de datos para abrir index.html sin servidor."""
import json
from pathlib import Path
base = Path(__file__).resolve().parent
lines = ['// Generado desde datos.json y demo.json. No editar manualmente.']
for filename, variable in [('datos.json', 'DATOS_PROYECTO'), ('demo.json', 'DEMO_PROYECTO')]:
    value = json.loads((base / filename).read_text(encoding='utf-8'))
    lines.append('window.' + variable + '=' + json.dumps(value, ensure_ascii=False) + ';')
(base / 'contenido.js').write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('contenido.js actualizado.')
