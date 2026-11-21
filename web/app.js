'use strict';
const nf=new Intl.NumberFormat('es-MX');
const miles=n=>nf.format(Math.round(n));
const dec=(n,d=2)=>Number(n).toFixed(d);
const pct=n=>dec(n)+'%';
const RETRATOS_PERSONAS={'Ale':'ale','Rubén':'ruben','Tere':'tere','Niko':'niko','Sofi':'sofi','Beto':'beto','Mar':'mar','Kari':'kari','Pau':'pau','Dani':'dani','Lupe':'lupe','Chava':'chava'};
const avatarPersona=(nombre,clase='avatar')=>{
  const retrato=RETRATOS_PERSONAS[nombre];if(!retrato)return `<span class="${clase} avatar-sin-retrato" aria-hidden="true">◉</span>`;
  const size=clase==='avatar-muestra'?'230px':clase.includes('retrato-elenco')?'(max-width:900px) 110px, 14vh':clase.includes('integrante-0')?'(max-width:520px) 86px, (max-width:800px) 80px, (max-width:1100px) 115px, 145px':clase.includes('retrato-integrante')?'(max-width:520px) 66px, (max-width:800px) 60px, (max-width:1100px) 88px, 110px':clase==='retrato-perfil'?'80px':'52px';
  return `<img class="${clase}" sizes="${size}" srcset="img/personas/${retrato}.webp 192w, img/personas/${retrato}-480.webp 480w" src="img/personas/${retrato}.webp" width="192" height="192" alt="" loading="lazy" decoding="async" data-retrato="${retrato}">`;
};
const icono=t=>ICONOS_ADOMICILIO.svg(t);
const foto=(slug,alt)=>`<figure class="visual"><img class="ilustracion" sizes="(max-width:900px) calc(100vw - 60px), 50vw" srcset="img/${slug}-960.webp 960w, img/${slug}.webp 1536w" src="img/${slug}.webp" width="1536" height="1024" alt="${alt}" loading="lazy" decoding="async"></figure>`;
function cargaImagenesSlide(slide){
  slide.querySelectorAll('img[data-src]').forEach((img,i)=>{
    img.loading='eager';if(i===0&&!img.hasAttribute('data-decor'))img.fetchPriority='high';
    if(img.dataset.srcset){img.srcset=img.dataset.srcset;delete img.dataset.srcset;}
    img.src=img.dataset.src;delete img.dataset.src;
  });
}
let SLIDES=[],actual=0;
if(!location.hash)history.replaceState(null,'','#demo');
function pinta(i,hash=true){
  AMBIENTE_SLIDES.cancelar();
  const anterior=actual,salida=AMBIENTE_SLIDES.capturar(document.querySelector('.slide.activa'));
  actual=Math.max(0,Math.min(i,SLIDES.length-1));
  const visible=document.getElementById('modo-slides').classList.contains('activo');
  document.querySelectorAll('.slide').forEach((s,j)=>{s.classList.toggle('activa',j===actual);s.setAttribute('aria-hidden',j!==actual);if(j===actual){s.scrollTop=0;if(visible)cargaImagenesSlide(s);}});
  document.getElementById('cuenta').textContent=`${String(actual+1).padStart(2,'0')} / ${SLIDES.length}`;
  document.getElementById('titulo-slide').textContent=SLIDES[actual].t;
  document.getElementById('progreso').style.width=((actual+1)/SLIDES.length*100)+'%';
  document.getElementById('atras').disabled=actual===0;document.getElementById('adelante').disabled=actual===SLIDES.length-1;
  document.querySelectorAll('[data-slide]').forEach(b=>b.setAttribute('aria-current',+b.dataset.slide===actual));
  if(hash)history.replaceState(null,'','#'+(actual+1));
  if(visible)AMBIENTE_SLIDES.entrar(document.querySelector('.slide.activa'),anterior,actual,salida);
}
function actualizaModo(modo){
  if(modo!=='slides')AMBIENTE_SLIDES.cancelar();
  document.body.dataset.modo=modo;
  document.querySelectorAll('#modos [data-modo]').forEach(b=>{if(b.dataset.modo===modo)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  document.querySelectorAll('.modo').forEach(m=>m.classList.toggle('activo',m.id==='modo-'+modo));
  if(modo!=='slides'&&document.fullscreenElement)document.exitFullscreen().catch(()=>{});
}
function cambiaModo(modo,navegar=true){
  actualizaModo(modo);if(indice.open)indice.close();
  if(modo==='demo'){if(navegar&&location.hash!=='#demo')history.pushState(null,'','#demo');window.dispatchEvent(new CustomEvent('demo:abrir',{detail:{navegar}}));}
  else if(navegar){const hash='#'+(actual+1);if(location.hash!==hash)history.pushState(null,'',hash);if(SLIDES.length)pinta(actual,false);}
}
function fullscreen(){
  if(!document.getElementById('modo-slides').classList.contains('activo'))return;
  const promise=document.fullscreenElement?document.exitFullscreen():document.getElementById('escenario').requestFullscreen?.();
  promise?.catch(()=>{});
}
document.getElementById('atras').onclick=()=>pinta(actual-1);
document.getElementById('adelante').onclick=()=>pinta(actual+1);
document.getElementById('pantalla').onclick=fullscreen;
document.getElementById('modos').addEventListener('click',e=>{const b=e.target.closest('[data-modo]');if(b)cambiaModo(b.dataset.modo);});
document.querySelector('.marca').onclick=e=>{e.preventDefault();cambiaModo('demo');};
const indice=document.getElementById('indice');
document.getElementById('indice-btn').onclick=()=>indice.showModal();
document.getElementById('cerrar-indice').onclick=()=>indice.close();
indice.onclick=e=>{if(e.target===indice)indice.close();};
document.addEventListener('click',e=>{const ir=e.target.closest('[data-ir]');if(ir)cambiaModo(ir.dataset.ir);const b=e.target.closest('[data-slide]');if(b){actual=b.dataset.slide*1;cambiaModo('slides');}});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});return;}
  if(indice.open||e.target.closest('input,select,textarea'))return;
  if(!document.getElementById('modo-slides').classList.contains('activo')||!SLIDES.length)return;
  if(e.key===' '&&e.target.closest('button,a'))return;
  if(e.key.toLowerCase()==='f'){fullscreen();return;}
  if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();pinta(actual+1);}
  if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();pinta(actual-1);}
  if(e.key==='Home')pinta(0);if(e.key==='End')pinta(SLIDES.length-1);
});
actualizaModo(location.hash.startsWith('#demo')?'demo':'slides');
let xInicial=null;const stage=document.getElementById('escenario');stage.addEventListener('touchstart',e=>{xInicial=e.changedTouches[0].clientX},{passive:true});stage.addEventListener('touchend',e=>{if(xInicial===null||!SLIDES.length)return;const dx=e.changedTouches[0].clientX-xInicial;if(Math.abs(dx)>75)pinta(actual+(dx<0?1:-1));xInicial=null},{passive:true});
async function iniciaSlides(){try{const D=(location.protocol==='file:'?window.DATOS_PROYECTO:null)||await fetch('datos.json').then(r=>{if(!r.ok)throw Error();return r.json()});SLIDES=construyeSlides(D);stage.innerHTML=SLIDES.map((s,i)=>`<article class="slide ${s.c||''} ${AMBIENTE_SLIDES.clases(i)}" aria-label="${i+1}. ${s.t}"><span class="folio">A DOMICILIO / ${String(i+1).padStart(2,'0')}</span>${s.html}${AMBIENTE_SLIDES.decoracion(i)}</article>`).join('').replaceAll(' src="',' data-src="').replaceAll(' srcset="',' data-srcset="');document.getElementById('lista-indice').innerHTML=SLIDES.map((s,i)=>`<button data-slide="${i}"><span>${String(i+1).padStart(2,'0')}</span>${s.t}</button>`).join('');pinta((parseInt(location.hash.slice(1),10)||1)-1,!location.hash.startsWith('#demo'));}catch(e){stage.innerHTML='<div class="copy"><h2>No pudimos cargar la presentación.</h2><p>Comprueba que datos.json y contenido.js estén junto a index.html y vuelve a abrir la página.</p></div>';}}
iniciaSlides();
function construyeSlides(D){
  const E=D.escala,G=D.ganador,seg=D.repeticion.por_segmento;
  const rivales=(D.modelos_test||[]).filter(m=>m.modelo!==G.modelo&&m.modelo!=='Lo de siempre'),rivalesPerdieron=rivales.filter(m=>m['ndcg@10']<G.ndcg_lo_de_siempre).length;
  const tarjetas=items=>`<div class="tarjetas">${items.map(([n,t,p])=>`<div class="tarjeta"><span class="paso">${n}</span><h3>${t}</h3><p>${p}</p></div>`).join('')}</div>`;
  return [
{t:'El siguiente antojo',c:'portada',html:`<div class="split"><div class="copy"><h2>¿Qué vas<br>a <em>cenar<br>hoy?</em></h2><p class="lead">A domicilio: recomendaciones para encontrar tu siguiente antojo.</p><p class="etiqueta" style="line-height:1.9">Diego Rafael Moctezuma Ramírez<br>Gonzalo Sebastián Mera Montiel</p><div class="sello">2 MILLONES<br>DE PEDIDOS.<br>UNA PREGUNTA.</div></div>${foto('portada-v2','Una mesa ilustrada con verduras, fideos y comida para compartir.')}</div>`},
{t:'El problema de elegir',html:`<div class="split"><div class="copy"><h2>Mucho para ver.<br><em>Lo mismo<br>para cenar.</em></h2><p class="lead">Tener muchas opciones no siempre ayuda a elegir. A veces, después de buscar, terminamos pidiendo lo de siempre.</p><div class="banda"><strong>El reto</strong><span>Encontrar lo que ya nos gusta<br>y darle espacio a un nuevo antojo.</span></div></div>${foto('scroll-infinito','Una persona mira opciones de comida en su teléfono sin decidir qué pedir.')}</div>`},
{t:'Sus favoritos importan',c:'oscura',html:`<div class="split"><div><div class="numero">${Math.round(E.tasa_repeticion)}<small>%</small></div><p class="stat-sub">de los pedidos de personas que ya habían comprado vuelven a un lugar conocido.</p><p class="dato-origen">En los pedidos reales que analizamos.</p></div><div class="copy stat-lateral"><h2>Volver también<br>es una<br>preferencia.</h2><p class="lead">Recomendar empieza por reconocer esos lugares que alguien vuelve a elegir.</p><div class="banda"><strong>La idea</strong><span>Que sus favoritos sigan cerca<br>cuando llegue el siguiente antojo.</span></div></div></div>`},
{t:'Cada pedido deja una pista',c:'grafica-legible',html:`<div class="split"><div class="copy"><h2>Cada pedido<br><em>deja una pista.</em></h2><p class="lead">Las personas con más pedidos suelen volver más a sus lugares conocidos.</p><p class="separador">Una misma lista para todos deja fuera esas diferencias.</p></div><div class="grafica" role="img" aria-label="Pedidos que vuelven a lugares conocidos: ${dec(seg['1'],0)} por ciento entre personas con un pedido previo, y ${dec(seg['20+'],0)} por ciento entre quienes tienen veinte o más."><h3>Volver a un lugar conocido</h3><div class="barras barras-habitos">${[['1 pedido previo',seg['1']],['20 o más',seg['20+']]].map(([k,v])=>`<div class="barra-col"><div class="bar" style="height:${v/70*100}%"><b>${dec(v,0)}%</b></div><small>${k}</small></div>`).join('')}</div><p class="eje">Según los pedidos que cada persona ya había hecho.</p></div></div>`},
{t:'El reto de aparecer',c:'oscura',html:`<div class="split">${foto('fonda-sola','Un restaurante pequeño, con un toldo rojo y una ventana iluminada.')}<div class="copy"><h2>Detrás de cada<br>opción, hay<br>un restaurante.</h2><p class="lead">En los pedidos analizados, <strong>${miles(E.n_vendors_pequenos)} lugares</strong> tenían pocos pedidos anteriores.</p><p class="lead">¿Cómo acercarlos a las personas que podrían elegirlos?</p></div></div>`},
{t:'Los antojos cambian',c:'azul popularidad-ilustrada',html:`<div class="split"><div class="copy"><h2>Lo popular ayer<br>no basta<br>para mañana.</h2><p class="lead"><strong>${E.top20_populares_sin_pedidos_en_test} de los 20</strong> lugares que más se pedían no recibieron pedidos en los quince días siguientes.</p><p class="lead">Una lista útil necesita seguir el ritmo de las personas.</p></div><div class="popularidad-visual">${foto('popularidad-tiempo','Un reloj de arena junto a menús y un tazón de comida: los pedidos cambian con el tiempo.')}<div class="popularidad-dato"><strong>${E.top20_populares_sin_pedidos_en_test}<small> / 20</small></strong><p>de los más pedidos antes<br>no recibieron pedidos después.</p></div></div></div>`},
{t:'Una mesa para cada gusto',c:'amarilla comercial-tarjetas',html:`<div class="mesa-cabecera"><div class="mesa-copy"><h2 class="gran-frase">Tu negocio.<br>Una mesa<br>para cada gusto.</h2><p class="lead">A domicilio está pensado para negocios que ya reciben pedidos y quieren ayudar a cada cliente a elegir.</p></div><figure class="mesa-banquete"><img src="img/mesa-gustos.webp" srcset="img/mesa-gustos-640.webp 640w, img/mesa-gustos.webp 960w" sizes="(max-width:900px) 35vw, 43vw" width="960" height="640" alt="Tres platillos distintos para compartir una misma mesa." loading="lazy" decoding="async"></figure></div>${tarjetas([['Para apps de pedidos','Todo el catálogo, personal','Sugerencias dentro de la app donde tus clientes ya piden.'],['Para plazas y campus','Varios locales, una sola app','Que cada persona encuentre su lugar entre todos los del patio.'],['Para grupos con varias marcas','Un antojo por descubrir','Acompañar la elección entre cocinas y propuestas distintas.']])}`},
{t:'Tu marca pone la mesa',c:'vino propuesta-experiencia',html:`<h2>Tu marca pone la mesa.<br>A domicilio sugiere.</h2><div class="flujo"><div class="tarjeta"><p class="etiqueta">Conocer</p><h3>Lo que ya piden</h3><p>Los lugares y sabores a los que cada persona suele volver.</p></div><span aria-hidden="true">→</span><div class="tarjeta motor"><p class="etiqueta">A domicilio</p><h3>Qué sugerir</h3><p>Una lista que toma en cuenta sus pedidos anteriores.</p></div><span aria-hidden="true">→</span><div class="tarjeta"><p class="etiqueta">Elegir</p><h3>Su siguiente antojo</h3><p>El cliente decide qué le apetece pedir.</p></div></div><p class="lead">Propuesta: llevar estas sugerencias al lugar donde tus clientes ya hacen sus pedidos.</p>`},
{t:'Una recomendación con contexto',c:'comercial-tarjetas',html:`<h2>Sus pedidos cuentan.<br><em>Su contexto también.</em></h2><div class="tarjetas"><div class="tarjeta">${icono('historial')}<h3>Sus favoritos</h3><p>Reconocer los lugares que ya forman parte de su rutina.</p></div><div class="tarjeta">${icono('grafo')}<h3>Otras posibilidades</h3><p>Buscar conexiones con lo que eligen personas con pedidos parecidos.</p></div><div class="tarjeta">${icono('lugar')}<h3>Su zona</h3><p>La ubicación de sus pedidos anteriores también ayuda a orientar la lista.</p></div></div>`},
{t:'De conocer a acompañar',c:'metodo-legible experiencia-personal',html:`<h2>Primero, conocer.<br><em>Después, acompañar.</em></h2><div class="timeline"><div class="periodo"><b>Reconocer</b><span>Lo que ya le gusta</span></div><div class="periodo"><b>Proponer</b><span>Opciones para elegir</span></div><div class="periodo"><b>Decidir</b><span>Su siguiente pedido</span></div></div><div class="split"><p class="lead">Diez sugerencias para empezar, con una razón detrás de cada una.</p><p class="separador">El cliente conserva la elección.<br>Tu marca acompaña el antojo.</p></div>`},
{t:'Una lista que se adelanta',c:'resultado-principal',html:`<div class="split"><div class="copy"><h2>Le gana<br><em>a la costumbre.</em></h2><div class="mejora-ranking"><strong>${rivalesPerdieron}<small> de ${rivales.length}</small></strong><p>estrategias no pudieron ganarle a repetir lo de siempre. <b>A domicilio sí.</b></p></div><p class="mejora-detalle">+${dec(G.vs_lo_de_siempre,1)}% frente a repetir lo de siempre</p><p class="lead">Los lugares que la gente pidió después quedaron mejor colocados entre las sugerencias.</p></div><div class="grafica ranking-claro" role="img" aria-label="Al comparar las sugerencias con los lugares que las personas pidieron después, A domicilio logró la mejor lista, seguido de repetir sus favoritos y de mostrar lo más popular."><h3>¿Qué lista anticipó mejor?</h3><p class="ranking-unidad">Poner primero los lugares que eligieron después.</p><div class="modelo-barras">${[['A domicilio',G.ndcg,'A partir de lo que cada persona ya pedía.'],['Repetir sus favoritos',G.ndcg_lo_de_siempre,'Volver a lo que ya conoce.'],['Lo más popular',G.ndcg_popularidad,'Las mismas sugerencias para todos.']].map(([n,v,frase],i)=>`<div class="modelo-fila"><div><span>${n}</span>${i===0?'<span class="ranking-sello">Mejor resultado</span>':''}</div><div class="pista"><div class="relleno" style="width:${Math.max(v/30*100,1.5)}%"></div></div><p class="ranking-detalle">${frase}</p></div>`).join('')}</div><p class="ranking-nota">Comparamos el orden de las sugerencias con los lugares que pidieron después.</p></div></div>`},
{t:'Conoce la experiencia',c:'azul invitacion-demo',html:`<div class="split"><div class="copy"><div class="marca marca-presentacion"><span class="marca-icono" aria-hidden="true">a.</span><span>A domicilio<small>EL SIGUIENTE ANTOJO</small></span></div><h2>12 historias reales.<br>12 formas de pedir.</h2><p class="lead">Escanea con tu cámara. Elige a una persona y descubre qué le propone A domicilio.</p><div class="elenco-invitacion" aria-hidden="true">${[Object.keys(RETRATOS_PERSONAS).slice(0,6),Object.keys(RETRATOS_PERSONAS).slice(6)].map(fila=>`<div class="elenco-fila">${fila.map(n=>avatarPersona(n,'retrato-invitado')).join('')}</div>`).join('')}</div></div><figure class="qr-demo"><img src="img/qr/qrAdomicilio.webp" alt="Código QR para abrir la experiencia de A domicilio" width="1000" height="1000"><figcaption>Abre la experiencia en tu teléfono</figcaption></figure></div>`},
{t:'La mesa de Ale',c:'amarilla ejemplo-persona',html:`<div class="split"><div class="copy"><div class="numero">1 <small>/ 3</small></div><h2 style="font-size:clamp(32px,3.3vw,50px)">de sus siguientes lugares<br>ya estaba entre<br>las sugerencias.</h2><p class="lead">A partir de sus pedidos anteriores se propusieron diez lugares para Ale. Uno apareció después entre sus tres elecciones.</p></div><div>${avatarPersona('Ale','avatar-muestra')}<div class="banda"><strong>Ale</strong><span>32 pedidos en dos restaurantes.<br>Suele pedir a las 17:00.</span></div></div></div>`},
{t:'Sus favoritos son el comienzo',c:'oscura promesa-doble',html:`<h2>Sus favoritos<br>son solo el comienzo.</h2><div class="recall"><div><h3>Volver a<br>lo que le gusta.</h3><p>Los pedidos anteriores ayudan a reconocer esos lugares que alguien vuelve a elegir.</p></div><div><h3>Dejar sitio<br>a lo nuevo.</h3><p>La propuesta también es abrir espacio a lugares que podrían convertirse en su próximo favorito.</p></div></div>`},
{t:'Dar espacio a otros lugares',c:'vino oportunidades',html:`<div class="split"><div class="copy"><h2>También hay lugar<br>para los menos conocidos.</h2><div class="oportunidad-cifra"><strong>${dec(D.arranque_frio[G.modelo],1)}<small>%</small></strong><p>de los lugares con pocos pedidos que la gente eligió después estaban en las sugerencias.</p></div><p class="oportunidad-contexto">Lugares con entre 1 y 50 pedidos anteriores en los datos analizados.</p></div>${foto('entrega-fonda','Una bolsa de comida pasa de una mano a otra: una oportunidad para que otro lugar llegue a la mesa.')}</div>`},
{t:'Una forma de trabajar juntos',c:'propuesta-comercial',html:`<div class="split"><div class="copy"><h2>Tu marca sigue<br><em>siendo protagonista.</em></h2><p class="lead">Proponemos una suscripción para incorporar recomendaciones a tu experiencia de pedidos, sin comisión por cada pedido.</p><p class="separador">El piloto definirá el alcance y el precio.</p></div><div class="copy"><div class="tarjeta"><span class="paso">Conocer</span><h3>Tu negocio y tus clientes</h3><p>Entender qué ofreces y cómo eligen las personas que te compran.</p></div><div class="tarjeta"><span class="paso">Acordar</span><h3>Una experiencia propia</h3><p>Definir dónde aparecerán las sugerencias y qué queremos lograr juntos.</p></div></div></div>`},
{t:'Historias reales detrás de la idea',c:'azul',html:`<h2>Historias reales.<br>Una propuesta que ya probamos.</h2><div class="tres-stats"><div><b>2 millones</b><p>Pedidos reales analizados para entender cómo elige la gente.</p></div><div><b>${miles(E.usuarios_eval)}</b><p>Personas con pedidos anteriores para contrastar las sugerencias.</p></div><div><b>${miles(E.vendors)}</b><p>Lugares en el catálogo analizado.</p></div></div><p class="lead">Con pedidos de Singapur, comparamos las sugerencias con los lugares que las personas eligieron después.</p>`},
{t:'Probémoslo en tu negocio',c:'comercial-tarjetas',html:`<h2>Hagamos una prueba<br><em>en tu negocio.</em></h2><p class="lead">El siguiente paso es conocer qué cambia cuando estas sugerencias llegan a tus clientes.</p>${tarjetas([['Elegir','Un caso concreto','Acordar en qué momento ayudar a tus clientes a decidir.'],['Probar','Con tu experiencia','Preparar una prueba que conserve tu marca y tu forma de atender.'],['Aprender','Qué eligen después','Observar qué descubren, qué eligen y cuántos pedidos completan.']])}`},
{t:'Tu siguiente recomendación',c:'portada cierre',html:`<div class="split"><div class="copy"><h2>¿Qué vas<br>a recomendar<br><em>mañana?</em></h2><p class="lead">Conserva tu marca. Acerca a cada cliente a su siguiente antojo.</p><button class="btn" data-ir="demo">Conoce A domicilio</button><p class="etiqueta">Hablemos de un piloto para tu negocio.</p></div>${foto('entrega-fonda','Una bolsa de comida pasa de una mano a otra. Una nueva elección conecta al cliente con un restaurante.')}</div>`}
  ];
}

function escapaDatos(v){if(typeof v==="string")return v.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));if(Array.isArray(v))return v.map(escapaDatos);if(v&&typeof v==="object")return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,escapaDatos(x)]));return v;}
const PERSONAJES={
  "El fiel":[
    {n:"Ale",r:"Pide con frecuencia y tiene un grupo de favoritos recurrentes.",ic:"Taza de café con vapor y un sello de 'otra vez'"},
    {n:"Rubén",r:"Tiene su menú de la semana resuelto y no lo mueve.",ic:"Calendario con el mismo plato repetido"},
    {n:"Tere",r:"Le gusta su rutina, pero acepta una sugerencia si viene de algo que ya conoce.",ic:"Tazón de arroz con palillos"}],
  "El explorador":[
    {n:"Niko",r:"Tiene un historial amplio y suele explorar restaurantes.",ic:"Brújula hecha con un tenedor"},
    {n:"Sofi",r:"Colecciona cocinas nuevas como quien colecciona estampas.",ic:"Pasaporte con sellos de comida"},
    {n:"Beto",r:"Pide seguido y visita muchos restaurantes distintos.",ic:"Mapa con muchos alfileres"}],
  "El ocasional":[
    {n:"Mar",r:"Tiene pocos pedidos: cada dato cuenta para conocerla.",ic:"Sofá con una caja de comida"},
    {n:"Kari",r:"Cuatro pedidos previos: el motor apenas la conoce.",ic:"Signo de interrogación sobre un plato"},
    {n:"Pau",r:"Entra poco y cada vez prueba algo distinto.",ic:"Dado sobre un mantel"}],
  "Sin historial":[
    {n:"Dani",r:"Sin pedidos previos en estos datos: el motor aún no lo conoce.",ic:"Celular recién encendido con la app vacía"},
    {n:"Lupe",r:"Sin historial anterior al corte de evaluación.",ic:"Bolsa de reparto cerrada con un moño"},
    {n:"Chava",r:"Cero pedidos previos: el motor recurre a popularidad reciente.",ic:"Hoja en blanco con un tenedor dibujado"}]
};
const etiquetaPlato=r=>r.especialidad||(r.cocina?`Cocina ${r.cocina}`:r.id);
// Dos restaurantes pueden compartir platillo estrella: se desempata con la zona.
function etiquetasUnicas(lista){
  const cuenta={};
  lista.forEach(r=>{const e=etiquetaPlato(r); cuenta[e]=(cuenta[e]||0)+1;});
  return r=>{const e=etiquetaPlato(r); return cuenta[e]>1 ? `${e} · ${r.zona||r.id.slice(0,4)}` : e;};
}
