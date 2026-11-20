"""Exporta demo.json: recomendaciones reales del modelo ganador para clientes de ejemplo.

Reusa el protocolo del notebook 01: historial congelado al cierre del entrenamiento,
grafo de co-visitas podado a 15 vecinos, caminata aleatoria con reinicio (alfa 0.6)
y candidatos restringidos al geohash del último pedido más sus ocho vecinos.

Selección de personas: cada arquetipo se define solo con pedidos anteriores al
corte (entrenamiento). Dentro de cada arquetipo se sortean personas con semilla
fija entre quienes tienen pedidos en la ventana de prueba, sin mirar si
repitieron o descubrieron. Para cada arquetipo se reporta además el acierto
promedio de una muestra aleatoria del grupo, para que los casos mostrados se
lean frente al promedio y no como ejemplos escogidos.

Explicaciones: la caminata con reinicio es proporcional a sum_h w_h * z_h, donde
w_h es el peso del restaurante h en el historial y z_h la caminata que parte solo
de h. Por eso el aporte de cada restaurante del historial al puntaje de una
recomendación se calcula de forma exacta, sin aproximar por vecinos directos.

Sincronía: este script repite a propósito parámetros y funciones del notebook
(alfa, poda del grafo, geohash, top-k determinista). Si cambia alguno en
01_motor_recomendacion.ipynb, debe cambiarse aquí también y volver a exportar.

Uso:  python3 02_export_demo.py            (desde la carpeta del proyecto)
Salida: web/demo.json
"""
import json
import os
from pathlib import Path

for variable in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS",
                 "VECLIB_MAXIMUM_THREADS", "NUMEXPR_NUM_THREADS"):
    os.environ.setdefault(variable, "2")

import numpy as np
import pandas as pd
import scipy.sparse as sp

CITY = os.environ.get("DHRD_CITY", "sg")
CIUDADES = {"sg": "Singapur", "se": "Estocolmo", "tw": "Taiwán"}
SEED = 42
TOP_K = 10
ALFA, PPR_TOL, PPR_MAX_ITER = 0.6, 1e-5, 60
MIN_COMPARTIDOS, K_VECINOS = 2, 15
rng = np.random.default_rng(SEED)


def resolver_datos():
    valor = os.environ.get("DHRD_DIR")
    if valor:
        return Path(valor).expanduser().resolve()
    inicio = Path.cwd().resolve()
    for padre in (inicio, *inicio.parents):
        for ruta in (padre / "Data" / "DHRD", padre / "DHRD"):
            if (ruta / f"data_{CITY}").is_dir():
                return ruta.resolve()
    raise FileNotFoundError("No se encontró Data/DHRD. Define DHRD_DIR.")


DATA_DIR = resolver_datos()
CITY_DIR = DATA_DIR / f"data_{CITY}"
SALIDA = Path(os.environ.get("DHRD_DEMO_OUT", "web/demo.json"))
SALIDA.parent.mkdir(parents=True, exist_ok=True)
print("Datos:", CITY_DIR, flush=True)

DTYPES = {"customer_id": "category", "geohash": "category", "vendor_id": "category",
          "product_id": "category", "order_id": "int32", "day_of_week": "int8"}

lineas_tr = pd.read_csv(CITY_DIR / f"orders_{CITY}_train.txt", index_col=0, dtype=DTYPES)
lineas_te = pd.read_csv(CITY_DIR / f"orders_{CITY}_test.txt", index_col=0, dtype=DTYPES)
vendors = pd.read_csv(CITY_DIR / f"vendors_{CITY}.txt", index_col=0).drop_duplicates("vendor_id")
products = pd.read_csv(CITY_DIR / f"products_{CITY}.txt", index_col=0)
print("líneas:", len(lineas_tr), len(lineas_te), flush=True)

for df in (lineas_tr, lineas_te):
    df["dia"] = df["order_day"].str.replace(" days", "", regex=False).astype("int16")
    df["hora"] = df["order_time"].str.slice(0, 2).astype("int8")


def a_pedidos(lineas):
    return (lineas.groupby("order_id", observed=True)
            .agg(customer_id=("customer_id", "first"), vendor_id=("vendor_id", "first"),
                 geohash=("geohash", "first"), dia=("dia", "first"),
                 dow=("day_of_week", "first"), hora=("hora", "first"),
                 order_time=("order_time", "first"), n_productos=("product_id", "size"))
            .reset_index())


ped_tr, ped_te = a_pedidos(lineas_tr), a_pedidos(lineas_te)
print("pedidos:", len(ped_tr), len(ped_te), flush=True)

# --- Índices del catálogo -----------------------------------------------------
vendor_idx = pd.Index(vendors.vendor_id.astype(str).unique())
v_pos = pd.Series(np.arange(len(vendor_idx)), index=vendor_idx)
usuarios = pd.Index(ped_tr.customer_id.astype(str).unique())
u_pos = pd.Series(np.arange(len(usuarios)), index=usuarios)

filas = ped_tr.customer_id.astype(str).map(u_pos).to_numpy()
cols = ped_tr.vendor_id.astype(str).map(v_pos).to_numpy()
ok = pd.notna(cols)
M = sp.csr_matrix((np.ones(int(ok.sum()), dtype=np.float32),
                   (filas[ok].astype(int), cols[ok].astype(int))),
                  shape=(len(usuarios), len(vendor_idx)))
M.sum_duplicates()
B = M.copy(); B.data[:] = 1.0
pop = np.asarray(M.sum(axis=0)).ravel()
recientes = ped_tr[ped_tr.dia > ped_tr.dia.max() - 14]
pop_rec = (recientes.vendor_id.astype(str).value_counts()
           .reindex(vendor_idx).fillna(0).to_numpy(dtype=np.float32))
print("matriz:", M.shape, M.nnz, flush=True)


# --- Grafo de co-visitas y caminata aleatoria --------------------------------
def vecinos_sparse(coocc, limit=K_VECINOS):
    coocc = coocc.tocsr().astype(np.float32)
    coocc.setdiag(0); coocc.eliminate_zeros()
    filas_, cols_, valores = [], [], []
    for i in range(coocc.shape[0]):
        a, z = coocc.indptr[i:i + 2]
        ids, w = coocc.indices[a:z], coocc.data[a:z]
        sel = np.lexsort((ids, -w))[:limit]
        filas_.extend([i] * len(sel)); cols_.extend(ids[sel]); valores.extend(w[sel])
    return sp.csr_matrix((np.array(valores, dtype=np.float32), (filas_, cols_)),
                         shape=coocc.shape)


coocc = (B.T @ B).tocsr()
grafo = coocc.copy()
grafo.data[grafo.data < MIN_COMPARTIDOS] = 0
grafo.eliminate_zeros()
grafo = vecinos_sparse(grafo)
grafo = grafo.maximum(grafo.T).tocsr()
grado = np.asarray(grafo.sum(axis=1)).ravel()
inv = np.divide(1., grado, out=np.zeros_like(grado), where=grado > 0)
P = (sp.diags(inv) @ grafo).tocsr()
colgantes = np.flatnonzero(grado == 0)
print("grafo:", grafo.nnz // 2, "aristas ·", len(colgantes), "sin aristas", flush=True)


def ppr(idx):
    p0 = M[idx].toarray()
    masa = p0.sum(axis=1, keepdims=True)
    p0 = np.divide(p0, masa, out=np.zeros_like(p0), where=masa > 0)
    x = p0.copy()
    for _ in range(PPR_MAX_ITER):
        faltante = x[:, colgantes].sum(axis=1, keepdims=True)
        nuevo = ALFA * (x @ P + faltante * p0) + (1 - ALFA) * p0
        residuo = float(np.abs(nuevo - x).sum(axis=1).max())
        x = nuevo
        if residuo < PPR_TOL:
            break
    return x


def caminata_desde(origenes):
    """Caminata con reinicio que parte de cada restaurante por separado.

    Sin redistribuir la masa de nodos colgantes: así la caminata del notebook es
    exactamente proporcional a sum_h w_h * z_h, y z_h mide el aporte de h.
    """
    e = np.zeros((len(origenes), len(vendor_idx)))
    e[np.arange(len(origenes)), origenes] = 1.0
    z = e.copy()
    for _ in range(PPR_MAX_ITER * 4):
        nuevo = ALFA * (z @ P) + (1 - ALFA) * e
        residuo = float(np.abs(nuevo - z).sum(axis=1).max())
        z = nuevo
        if residuo < PPR_TOL / 10:
            break
    return z


def aportes_historial(fila_usuario, hist_idx):
    """Matriz historial × catálogo: aporte de cada restaurante visitado."""
    if not len(hist_idx):
        return np.zeros((0, len(vendor_idx)))
    pesos = M[fila_usuario, hist_idx].toarray().ravel()
    pesos = pesos / pesos.sum()
    aportes = pesos[:, None] * caminata_desde(hist_idx)
    # Comprobación: la suma de aportes es proporcional al puntaje de la caminata.
    puntaje = ppr(np.array([fila_usuario]))[0]
    suma = aportes.sum(axis=0)
    escala = puntaje.sum() / suma.sum()
    assert np.abs(suma * escala - puntaje).max() <= 1e-4 * puntaje.max(), "Atribución inconsistente"
    return aportes


# --- Candidatos por zona (geohash del último pedido) --------------------------
_GEO = "0123456789bcdefghjkmnpqrstuvwxyz"


def _geo_bounds(code):
    lat, lon, par = [-90., 90.], [-180., 180.], True
    for char in code:
        if char not in _GEO:
            return None
        valor = _GEO.index(char)
        for bit in (16, 8, 4, 2, 1):
            intervalo = lon if par else lat
            medio = sum(intervalo) / 2
            intervalo[0 if valor & bit else 1] = medio
            par = not par
    return lat, lon


def _geo_encode(lat, lon, largo=5):
    rlat, rlon, salida, valor, bits, par = [-90., 90.], [-180., 180.], [], 0, 0, True
    while len(salida) < largo:
        intervalo = rlon if par else rlat
        x = lon if par else lat
        medio = sum(intervalo) / 2
        valor = (valor << 1) | int(x >= medio)
        intervalo[0 if x >= medio else 1] = medio
        par = not par; bits += 1
        if bits == 5:
            salida.append(_GEO[valor]); valor = bits = 0
    return "".join(salida)


def zonas_vecinas(code):
    code = str(code)[:5]
    limites = _geo_bounds(code) if len(code) == 5 else None
    if limites is None:
        return None
    lat, lon = limites
    y, x = sum(lat) / 2, sum(lon) / 2
    dy, dx = lat[1] - lat[0], lon[1] - lon[0]
    return {_geo_encode(np.clip(y + a * dy, -89.999999, 89.999999),
                        (x + b * dx + 180) % 360 - 180)
            for a in (-1, 0, 1) for b in (-1, 0, 1)}


vendor_zonas = (vendors.set_index("vendor_id").reindex(vendor_idx).geohash
                .fillna("").astype(str).str[:5].to_numpy())
_todos = np.arange(len(vendor_idx), dtype=np.int32)
_cache = {}


def candidatos(code):
    clave = str(code)[:5]
    if clave not in _cache:
        vecinas = zonas_vecinas(clave)
        _cache[clave] = (_todos if vecinas is None
                         else np.flatnonzero(np.isin(vendor_zonas, list(vecinas))))
    return _cache[clave]


def top_determinista(valores, item_ids, k=TOP_K):
    if not len(item_ids):
        return np.empty(0, dtype=int)
    take = min(k, len(item_ids))
    if len(item_ids) > take:
        corte = np.partition(valores, len(valores) - take)[len(valores) - take]
        mayores = np.flatnonzero(valores > corte)
        empates = np.flatnonzero(valores == corte)
        empates = empates[np.argsort(item_ids[empates], kind="stable")][:take - len(mayores)]
        sel = np.r_[mayores, empates]
    else:
        sel = np.arange(len(item_ids))
    sel = sel[np.lexsort((item_ids[sel], -valores[sel]))]
    return item_ids[sel].astype(int)


# --- Etiquetas legibles: el catálogo no trae nombre de restaurante -----------
# Se usa su producto más pedido como "especialidad" y la cocina declarada.
# Se trabaja sobre los códigos de las categorías: pasar 3.4 millones de filas a
# texto agota la memoria del equipo.
conteo_vp = (lineas_tr.groupby(["vendor_id", "product_id"], observed=True)
             .size().rename("n").reset_index())
conteo_vp["vendor_id"] = conteo_vp["vendor_id"].astype(str)
conteo_vp["product_id"] = conteo_vp["product_id"].astype(str)
top_producto = (conteo_vp.sort_values(["vendor_id", "n"], ascending=[True, False])
                .drop_duplicates("vendor_id").set_index("vendor_id"))
del conteo_vp
nombre_prod = products.drop_duplicates("product_id").set_index("product_id")["name"]
cocina = vendors.set_index("vendor_id")["primary_cuisine"]
zona_v = vendors.set_index("vendor_id")["geohash"]


def especialidad(vid):
    if vid not in top_producto.index:
        return None
    pid = top_producto.loc[vid, "product_id"]
    nombre = nombre_prod.get(pid)
    return None if pd.isna(nombre) else str(nombre)


def ficha(j):
    vid = str(vendor_idx[j])
    coc = cocina.get(vid)
    return {"id": vid,
            "cocina": None if pd.isna(coc) else str(coc).strip(),
            "especialidad": especialidad(vid),
            "zona": str(zona_v.get(vid, ""))[:5],
            "pedidos_train": int(pop[j])}


# --- Perfiles de ejemplo ------------------------------------------------------
ped_tr["cid"] = ped_tr.customer_id.astype(str)
ped_te["cid"] = ped_te.customer_id.astype(str)
ped_tr["vid"] = ped_tr.vendor_id.astype(str)
ped_te["vid"] = ped_te.vendor_id.astype(str)
del lineas_tr, lineas_te

stats = (ped_tr.groupby("cid", observed=True)
         .agg(pedidos=("order_id", "size"), vendors=("vid", "nunique"),
              hora=("hora", "mean"), ultimo=("dia", "max")))
test_sets = ped_te.groupby("cid", observed=True)["vid"].apply(set)
hist_sets = ped_tr.groupby("cid", observed=True)["vid"].apply(set)

con_test = stats.loc[stats.index.intersection(test_sets.index)].copy()
con_test["repetidos"] = [len(test_sets[c] & hist_sets[c]) for c in con_test.index]
con_test["nuevos"] = [len(test_sets[c] - hist_sets[c]) for c in con_test.index]
con_test["concentracion"] = con_test.pedidos / con_test.vendors


# Arquetipos definidos solo con entrenamiento. Se exige tener pedidos en la
# ventana de prueba (igual que en la evaluación), pero no se mira qué pidieron.
ARQUETIPOS = {
    "El fiel": (con_test.pedidos >= 12) & (con_test.concentracion >= 3),
    "El explorador": (con_test.vendors >= 10) & (con_test.concentracion < 1.4),
    "El ocasional": con_test.pedidos.between(2, 4),
}
POR_ARQUETIPO, MUESTRA_GRUPO = 3, 2000
sorteo = np.random.default_rng(SEED + 7)


def sortear(indices, n):
    indices = np.array(sorted(indices), dtype=object)
    return list(sorteo.permutation(indices)[:min(n, len(indices))])


elegidos, muestras_grupo, elegibles_grupo = [], {}, {}
for perfil, filtro in ARQUETIPOS.items():
    miembros = con_test.index[filtro]
    elegibles_grupo[perfil] = len(miembros)
    elegidos += [(c, perfil) for c in sortear(miembros, POR_ARQUETIPO)]
    muestras_grupo[perfil] = sortear(miembros, MUESTRA_GRUPO)

nuevos_usuarios = [c for c in test_sets.index if c not in hist_sets.index]
elegibles_grupo["Sin historial"] = len(nuevos_usuarios)
elegidos += [(c, "Sin historial") for c in sortear(nuevos_usuarios, POR_ARQUETIPO)]
muestras_grupo["Sin historial"] = sortear(nuevos_usuarios, MUESTRA_GRUPO)
print("usuarios elegidos:", len(elegidos), flush=True)

con_hist = [(c, p) for c, p in elegidos if p != "Sin historial"]
pos = u_pos.loc[[c for c, _ in con_hist]].to_numpy(dtype=int)
puntajes = ppr(pos)

salida_usuarios = []
_sel = {c for c, _ in con_hist}
grupos_hist = {c: g for c, g in ped_tr[ped_tr.cid.isin(_sel)].groupby("cid", observed=True)}
for fila, (cid, perfil) in enumerate(con_hist):
    historia = grupos_hist[cid]
    ultimo = historia.sort_values(["dia", "order_time", "order_id"]).iloc[-1]
    zona = str(ultimo.geohash)
    cands = candidatos(zona)
    s = puntajes[fila]
    top = top_determinista(s[cands], cands)
    conocidos = set(M[pos[fila]].indices.tolist())
    objetivo = {int(v_pos[v]) for v in test_sets[cid] if v in v_pos.index}

    # ¿Por qué? Aporte exacto de cada restaurante del historial al puntaje.
    hist_idx = np.array(sorted(conocidos), dtype=int)
    aportes = aportes_historial(pos[fila], hist_idx)
    recs = []
    for j in top:
        if j in conocidos:
            veces = int(M[pos[fila], j])
            razon = f"Ya pediste aquí {veces} {'vez' if veces == 1 else 'veces'}"
            origen = None
        else:
            col = aportes[:, j]
            total = float(col.sum())
            if total > 0:
                h = int(np.argmax(col))
                info = ficha(int(hist_idx[h]))
                etiqueta = info["especialidad"] or info["cocina"] or info["id"]
                pct = int(round(100 * col[h] / total))
                razon = f"Por tus pedidos en «{etiqueta}» ({pct}% del puntaje)"
                origen = {"id": info["id"], "etiqueta": etiqueta, "aporte_pct": pct,
                          "vecino_directo": bool(P[hist_idx[h], j] > 0)}
            else:
                razon = "Sin relación con tu historial; completa la lista"
                origen = None
        f = ficha(int(j))
        f.update(tipo="conocido" if j in conocidos else "nuevo", razon=razon,
                 origen=origen, acierto=bool(j in objetivo))
        recs.append(f)

    cocinas = historia.vid.map(cocina).dropna().str.strip().value_counts()
    hist_detalle = (historia.vid.value_counts().head(4)
                    .rename_axis("vid").reset_index(name="veces"))
    salida_usuarios.append({
        "id": cid, "perfil": perfil,
        "resumen": {"pedidos": int(stats.loc[cid, "pedidos"]),
                    "restaurantes": int(stats.loc[cid, "vendors"]),
                    "hora_tipica": int(round(float(stats.loc[cid, "hora"]))),
                    "zona": zona[:5],
                    "cocinas": [[k, int(v)] for k, v in cocinas.head(3).items()],
                    "candidatos_en_zona": int(len(cands))},
        "historial": [dict(ficha(int(v_pos[r.vid])), veces=int(r.veces))
                      for r in hist_detalle.itertuples() if r.vid in v_pos.index],
        "recomendaciones": recs,
        "realidad": {"pidio": [ficha(int(j)) for j in sorted(objetivo)][:6],
                     "aciertos": int(sum(r["acierto"] for r in recs)),
                     "objetivos": len(objetivo)},
    })

# Clientes sin historial: no hay perfil, se usa el recurso de reserva del notebook
for cid, perfil in [(c, p) for c, p in elegidos if p == "Sin historial"]:
    objetivo = {int(v_pos[v]) for v in test_sets[cid] if v in v_pos.index}
    top = top_determinista(pop_rec[_todos], _todos)
    recs = []
    for j in top:
        f = ficha(int(j))
        f.update(tipo="nuevo", razon="Lo más pedido en las últimas dos semanas",
                 acierto=bool(j in objetivo))
        recs.append(f)
    salida_usuarios.append({
        "id": cid, "perfil": perfil,
        "resumen": {"pedidos": 0, "restaurantes": 0, "hora_tipica": None,
                    "zona": None, "cocinas": [], "candidatos_en_zona": len(_todos)},
        "historial": [], "recomendaciones": recs,
        "realidad": {"pidio": [ficha(int(j)) for j in sorted(objetivo)][:6],
                     "aciertos": int(sum(r["acierto"] for r in recs)),
                     "objetivos": len(objetivo)},
    })

# --- Acierto promedio de cada arquetipo (muestra aleatoria del grupo) ----------
def resumen_grupo(perfil, clientes):
    aciertos, objetivos, con_acierto = [], [], 0
    for ini in range(0, len(clientes), 500):
        lote = clientes[ini:ini + 500]
        if perfil == "Sin historial":
            listas = [top_determinista(pop_rec[_todos], _todos)] * len(lote)
        else:
            filas_lote = u_pos.loc[lote].to_numpy(dtype=int)
            puntos = ppr(filas_lote)
            ultimos = (ped_tr[ped_tr.cid.isin(set(lote))]
                       .sort_values(["dia", "order_time", "order_id"])
                       .drop_duplicates("cid", keep="last").set_index("cid").geohash)
            listas = []
            for k, cid in enumerate(lote):
                cands = candidatos(str(ultimos[cid]))
                listas.append(top_determinista(puntos[k][cands], cands))
        for cid, lista in zip(lote, listas):
            objetivo = {int(v_pos[v]) for v in test_sets[cid] if v in v_pos.index}
            n_obj = len(test_sets[cid])
            hits = len(set(lista.tolist()) & objetivo)
            aciertos.append(hits); objetivos.append(n_obj); con_acierto += hits > 0
    aciertos, objetivos = np.array(aciertos), np.array(objetivos)
    return {"elegibles": int(elegibles_grupo[perfil]), "evaluados": int(len(clientes)),
            "pct_con_algun_acierto": float(100 * con_acierto / max(len(clientes), 1)),
            "aciertos_promedio": float(aciertos.mean()) if len(aciertos) else 0.0,
            "objetivos_promedio": float(objetivos.mean()) if len(objetivos) else 0.0,
            "recall_medio_pct": float(100 * np.mean(aciertos / np.maximum(objetivos, 1)))
            if len(aciertos) else 0.0}


arquetipos = {perfil: resumen_grupo(perfil, clientes) for perfil, clientes in muestras_grupo.items()}
for perfil, r in arquetipos.items():
    print(f"  grupo {perfil:14s} {r}", flush=True)

demo = {
    "generado": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M"),
    "ciudad": CIUDADES[CITY],
    "modelo": "Caminata aleatoria (PPR)",
    "parametros": {"alfa": ALFA, "k_vecinos": K_VECINOS,
                   "min_clientes_compartidos": MIN_COMPARTIDOS, "top_k": TOP_K},
    "nota_nombres": ("El dataset no publica el nombre de los restaurantes: se identifican "
                     "por su tipo de cocina y por su producto más pedido."),
    "seleccion": ("Cada grupo se define solo con pedidos anteriores al corte. Las personas "
                  "se sortearon con semilla fija entre quienes pidieron en la ventana de "
                  "prueba, sin mirar si repitieron o descubrieron."),
    "arquetipos": arquetipos,
    "usuarios": salida_usuarios,
}
SALIDA.write_text(json.dumps(demo, ensure_ascii=False, indent=1), encoding="utf-8")
print("escrito", SALIDA, SALIDA.stat().st_size, "bytes", flush=True)
for u in salida_usuarios:
    print(f"  {u['perfil']:14s} {u['id']} · {u['realidad']['aciertos']}/{u['realidad']['objetivos']} aciertos")
