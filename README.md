# Sistema-Recomendaci-n

## Sincronía entre el notebook y el demo

`02_export_demo.py` repite a propósito parámetros y funciones de `01_motor_recomendacion.ipynb`
(alfa de la caminata, poda del grafo, geohash y top-k determinista). Si se cambia alguno en el
notebook, hay que cambiarlo también en el script y volver a exportar `web/demo.json`
(y después `python3 web/actualizar_datos.py`).
