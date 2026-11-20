'use strict';
(async function iniciaDemo(){
  const $=id=>document.getElementById(id);
  const GRUPOS={
    'El fiel':{nombre:'Los de siempre',pregunta:'¿Para qué cambiar lo que le gusta?',descripcion:'Sus favoritos forman parte de su rutina. La propuesta empieza por reconocer esos lugares a los que vuelve.',corto:'Vuelve a sus favoritos.',color:'fiel'},
    'El explorador':{nombre:'Los que exploran',pregunta:'¿Y si hoy probamos otra cosa?',descripcion:'Sus pedidos pasan por distintos restaurantes. Siempre hay espacio para su siguiente descubrimiento.',corto:'Le gusta probar algo distinto.',color:'explorador'},
    'El ocasional':{nombre:'Los de vez en cuando',pregunta:'Pocos pedidos, muchas posibilidades.',descripcion:'Unos cuantos pedidos empiezan a contar su historia. Cada uno deja una pista sobre sus gustos.',corto:'Pide poco. Cada dato cuenta.',color:'ocasional'},
    'Sin historial':{nombre:'Los que empiezan',pregunta:'Su primera mesa está por descubrirse.',descripcion:'Todavía no hay pedidos anteriores para conocer sus gustos. Su menú empieza por lugares populares recientes.',corto:'Su historia apenas comienza.',color:'nuevo'}
  };
  const COCINAS={'rice dishes':'Arroces','chicken rice':'Arroz con pollo',chinese:'China',japanese:'Japonesa',indian:'India',coffee:'Café',dessert:'Postres',pizza:'Pizza',noodles:'Fideos',soups:'Sopas',thai:'Tailandesa','bubble tea':'Té de burbujas','dim sum':'Dim sum',seafood:'Mariscos',vegetarian:'Vegetariana',ramen:'Ramen','mala xiang guo':'Hotpot',korean:'Coreana','fried rice':'Arroz frito',chicken:'Pollo','fried chicken':'Pollo frito',singaporean:'Singapur',mexican:'Mexicana',curry:'Curry','nasi lemak':'Nasi lemak','yong tau foo':'Yong tau foo','ayam penyet':'Ayam penyet',cakes:'Pasteles',american:'Americana',pasta:'Pasta'};
  const cocina=c=>COCINAS[c]||c||'Sin cocina declarada';
  const comida=c=>ICONOS_ADOMICILIO.cocina(c);
  const menosMovimiento=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scrollFrame=0,scrollSecuencia=0;
  function cancelaScroll(){cancelAnimationFrame(scrollFrame);scrollFrame=0;scrollSecuencia++;}
  function desplazaHasta(elemento,{margen=16,duracion=640,alTerminar}={}){
    if(!elemento)return;cancelaScroll();const cont=$('modo-demo'),inicio=cont.scrollTop;
    const meta=Math.max(0,Math.min(cont.scrollHeight-cont.clientHeight,inicio+elemento.getBoundingClientRect().top-cont.getBoundingClientRect().top-margen));
    if(menosMovimiento()||Math.abs(meta-inicio)<2){cont.scrollTop=meta;alTerminar?.();return;}
    const propia=scrollSecuencia,tiempo=performance.now(),duracionReal=Math.min(duracion,Math.max(320,Math.abs(meta-inicio)*.45));
    function paso(ahora){if(propia!==scrollSecuencia||!elemento.isConnected)return;const t=Math.min(1,(ahora-tiempo)/duracionReal),curva=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;cont.scrollTop=inicio+(meta-inicio)*curva;if(t<1)scrollFrame=requestAnimationFrame(paso);else{scrollFrame=0;alTerminar?.();}}
    scrollFrame=requestAnimationFrame(paso);
  }
  function entradaSuave(elemento,escalon=false){if(!elemento||menosMovimiento())return;const elementos=escalon?[...elemento.children]:[elemento];elementos.forEach((el,i)=>el.animate([{opacity:.15,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:escalon?220:240,delay:escalon?Math.min(i*35,70):0,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));}
  for(const evento of ['wheel','touchstart','pointerdown'])$('modo-demo').addEventListener(evento,cancelaScroll,{passive:true});
  $('modo-demo').addEventListener('keydown',e=>{if(!e.defaultPrevented&&['ArrowUp','ArrowDown','PageUp','PageDown','Home','End','Escape',' '].includes(e.key))cancelaScroll();});

  let scrollElegir=0;
  let indicePersona=0,grupo='El fiel',vista='recomendaciones',pantalla='elegir',revelado=false;
  try{
    const raw=location.protocol==='file:'&&window.DEMO_PROYECTO?window.DEMO_PROYECTO:await fetch('demo.json').then(r=>{if(!r.ok)throw Error('datos');return r.json()});
    const DEMO=escapaDatos(raw),usados={};
    const gente=DEMO.usuarios.map((u,i)=>{const lista=PERSONAJES[u.perfil]||PERSONAJES['El ocasional'];const k=(usados[u.perfil]=(usados[u.perfil]??-1)+1)%lista.length;return{...u,persona:lista[k],i};});
    $('pie-demo').textContent=raw.nota_nombres+' '+(raw.seleccion||'')+' Las listas se calcularon antes de la prueba. Con historial: última zona conocida y ocho vecinas. Sin historial: popularidad reciente global, sin inferir ubicación futura. Modelo: '+raw.modelo+'.';
    function tipos(g){return {conocidos:g.recomendaciones.filter(r=>r.tipo==='conocido').length,nuevos:g.recomendaciones.filter(r=>r.tipo!=='conocido').length,cocinas:new Set(g.recomendaciones.map(r=>r.cocina).filter(Boolean)).size};}
    function historiaPersona(g){return ({Kari:`Con ${miles(g.resumen.pedidos)} pedidos anteriores, su historia apenas comienza.`,Dani:'Todavía no hay pedidos anteriores para conocer sus gustos.',Lupe:'Su primera mesa está por descubrirse: aún no hay pedidos anteriores.',Chava:'Su historia empieza por explorar lugares populares recientes.'})[g.persona.n]||g.persona.r;}
    function ruta(push=true){const hash=pantalla==='elegir'?'#demo':`#demo/${indicePersona}/${vista}`;if(push&&location.hash!==hash)history.pushState(null,'',hash);}
    function renderGrupos(){
      $('arquetipos').innerHTML=Object.entries(GRUPOS).map(([perfil,c],i)=>`<button class="arquetipo ${c.color}" data-grupo="${perfil}" aria-pressed="${grupo===perfil}"><div class="arquetipo-arriba"><span>0${i+1}</span><span class="grupo-check" aria-hidden="true">${grupo===perfil?'✓':'↗'}</span></div><div class="retrato-trio" aria-hidden="true">${gente.filter(x=>x.perfil===perfil).map((x,k)=>avatarPersona(x.persona.n,'retrato-integrante integrante-'+k)).join('')}</div><h2>${c.nombre}</h2><p>${c.corto}</p><span class="grupo-cantidad">3 personas para conocer</span></button>`).join('');
    }
    function renderSeleccion(){
      renderGrupos();const g=gente[indicePersona],c=GRUPOS[grupo];$('titulo-grupo').textContent=c.pregunta;$('detalle-grupo').textContent=c.descripcion;
      $('personas-grupo').innerHTML=gente.filter(x=>x.perfil===grupo).map(x=>`<button class="persona-opcion" data-persona="${x.i}" aria-pressed="${indicePersona===x.i}">${avatarPersona(x.persona.n)}<span><strong>${x.persona.n}</strong><small>${miles(x.resumen.pedidos)} ${x.resumen.pedidos===1?'pedido':'pedidos'} · ${miles(x.resumen.restaurantes)} ${x.resumen.restaurantes===1?'lugar':'lugares'}</small></span><span class="persona-check" aria-hidden="true">${indicePersona===x.i?'✓':'+'}</span></button>`).join('');
      const top=g.resumen.cocinas[0];$('preview-persona').innerHTML=`<div class="preview-texto"><span class="etiqueta">Conoce a ${g.persona.n}</span><p>${historiaPersona(g)}</p><div class="preview-pistas"><span>${top?'Su cocina más frecuente: <strong>'+cocina(top[0])+'</strong>':'<strong>Su primera historia está por empezar</strong>'}</span><span>${g.resumen.hora_tipica!==null?'Hora típica: <strong>'+g.resumen.hora_tipica+':00</strong>':'El punto de partida: <strong>lugares populares recientes</strong>'}</span></div></div><button class="btn ver-recomendaciones" id="ver-recomendaciones">Ver el menú de ${g.persona.n}</button>`;
    }
    function perfil(g){
      $('perfil-demo').innerHTML=`<div class="perfil-resumen"><div class="perfil-persona">${avatarPersona(g.persona.n,'retrato-perfil')}<div><p class="etiqueta">${GRUPOS[g.perfil].nombre}</p><h1 id="nombre-persona" tabindex="-1">La mesa de ${g.persona.n}.</h1><p>${g.resumen.pedidos?miles(g.resumen.pedidos)+' pedidos anteriores · '+miles(g.resumen.restaurantes)+(g.resumen.restaurantes===1?' lugar distinto':' lugares distintos'):'Un primer menú por descubrir'}</p></div></div><p class="perfil-guia">Una historia, diez sugerencias y un siguiente antojo.</p></div>`;
    }
    function resumenHistorial(g){
      const n=g.resumen.pedidos,r=g.resumen.restaurantes;
      return `<div class="historial-resumen"><div><b>${miles(n)}</b><span>pedidos anteriores</span></div><div><b>${miles(r)}</b><span>lugares distintos</span></div><div><b>${g.resumen.hora_tipica===null?'—':g.resumen.hora_tipica+':00'}</b><span>hora típica</span></div><div><b>${g.resumen.cocinas.length||'—'}</b><span>cocinas en este resumen</span></div></div><p class="historial-pista">${n?(n/r>3?'Sus favoritos dejan una pista sobre lo que le gusta volver a elegir.':'Cada pedido suma una pista sobre sus gustos.'):'Todavía no hay favoritos observados. Su menú empieza por lo que otras personas han pedido últimamente.'}</p>`;
    }
    function favoritos(g,compacto=false){if(!g.historial.length)return `<div class="sin-historial"><span class="vacio-icono">${icono('historial')}</span><h3>Una mesa por conocer.</h3><p>Todavía no hay pedidos anteriores de ${g.persona.n}. Sus gustos están por descubrirse.</p><div class="nota-metodo"><strong>Un punto de partida</strong><br>Su menú reúne lugares que otras personas han pedido recientemente.</div></div>`;
      const max=Math.max(...g.historial.map(r=>r.veces));return `<div class="historial-lista ${compacto?'compacta':''}">${g.historial.map((r,k)=>`<article class="historial-item"><div class="historial-cab"><span class="comida-icono">${comida(r.cocina)}</span><div><p class="etiqueta">${cocina(r.cocina)}</p><h3>${etiquetaPlato(r)}</h3></div><strong>${r.veces}<small>${r.veces===1?'pedido':'pedidos'}</small></strong></div><div class="historial-barra" aria-hidden="true"><i style="width:${r.veces/max*100}%"></i></div>${compacto?'':`<details class="historial-origen"><summary>Datos de este lugar</summary><p class="historial-meta">Restaurante ${r.id} · zona ${r.zona||'no disponible'}</p></details>`}</article>`).join('')}</div>`;
    }
    function gustos(g){return g.resumen.cocinas.length?`<div class="gustos-lista">${g.resumen.cocinas.map(([c,n])=>`<div><span>${cocina(c)}</span><b>${n} ${n===1?'pedido':'pedidos'}</b><div class="gusto-barra"><i style="width:${n/g.resumen.pedidos*100}%"></i></div></div>`).join('')}</div><p class="nota-pequena">Sus cocinas más frecuentes; este resumen no incluye todos los pedidos.</p>`:'<p class="nota-pequena">Todavía no hay pedidos para conocer sus cocinas favoritas.</p>';}
    function grupoContexto(g){
      const a=(DEMO.arquetipos||{})[g.perfil]
      if(!a)return ''
      return `<details class="resultado-contexto"><summary>Qué pasó en historias parecidas</summary><p>En una muestra al azar de ${miles(a.evaluados)} personas de «${GRUPOS[g.perfil].nombre}», al menos un lugar de sus elecciones posteriores ya estaba en las sugerencias en el ${Math.round(a.pct_con_algun_acierto)}% de los casos.</p><p>En promedio coincidieron ${a.aciertos_promedio.toFixed(1)} de ${a.objetivos_promedio.toFixed(1)} lugares. ${g.persona.n} se eligió al azar dentro del grupo; no por su resultado.</p></details>`
    }
    function razonPersonaje(g,r){
      const texto=String(r.razon||'').trim(),nombre=g.persona.n;
      const repeticion=texto.match(/^Ya pediste aquí (\d+) (?:veces|vez)\.?$/i);
      if(repeticion){const veces=Number(repeticion[1]);return `${nombre} ha pedido en este restaurante ${miles(veces)} ${veces===1?'vez':'veces'}.`;}
      const conexion=texto.match(/^Clientes que piden en «(.+)» también piden aquí\.?$/i);
      if(conexion)return `Personas que piden en «${conexion[1]}», como ${nombre}, también eligen este lugar.`;
      const aporte=texto.match(/^Por tus pedidos en «(.+)» \((\d+)% del puntaje\)\.?$/i)
      if(aporte)return `${nombre} recibe esta sugerencia por sus pedidos en «${aporte[1]}».`;
      if(/^Sin relación con tu historial/i.test(texto))return `Esta opción amplía el menú de ${nombre}; no parte de sus pedidos anteriores.`;
      if(/^Lo más pedido en las últimas dos semanas\.?$/i.test(texto))return `${nombre} recibe esta sugerencia porque el restaurante está entre los más pedidos de las últimas dos semanas.`;
      return `Este restaurante forma parte del menú sugerido para ${nombre}.`;
    }
    function motivoTitulo(r){if(r.tipo==='conocido')return 'Ya tiene historia con este lugar';if(/^Lo más pedido/i.test(r.razon))return 'Un lugar popular reciente';if(/^Sin relación/i.test(r.razon))return 'Una opción más para explorar';return 'Una pista en sus pedidos';}
    function razonDetalle(g,r){const aporte=String(r.razon||'').match(/^Por tus pedidos en «(.+)» \((\d+)% del puntaje\)\.?$/i);return aporte?`${g.persona.n}: los pedidos en el lugar «${aporte[1]}» aportan el ${aporte[2]}% del puntaje de la recomendación.`:razonPersonaje(g,r);}
    // The exported model ranks restaurants; this visual score is explicitly a demo scale.
    const afinidad=k=>98-3*k;
    const fotoProducto=r=>{const nombre=(r.especialidad||'').toLowerCase(),c=(r.cocina||'').toLowerCase();
      if(/pizza|tortilla pizza/.test(nombre+' '+c))return 'pizza';
      if(/bun|bao|dumpling|shumai|siew mai|siu mai|dim sum/.test(nombre+' '+c))return 'dimsum';
      if(/noodle|ramen|laksa|kway teow|mee |hotpot|hot pot/.test(nombre+' '+c))return 'fideos';
      if(/\b(coffee|tea|kopi|teh|latte|cappuccino|soymilk)\b/.test(nombre+' '+c))return 'cafe';
      if(/dessert|cake|custard|cream puff|mango|chocolate|donut|doughnut|cupcake|pastry/.test(nombre+' '+c))return 'postre';
      return 'arroz';
    };
    const imagenProducto=(r,clase='',detalle=false)=>{
      const src=window.IMAGENES_PLATILLOS?.[r.id]||('img/comida-'+fotoProducto(r)+'.webp'),base=src.replace(/\.webp$/,'');
      const sizes=detalle?'(max-width:700px) 100vw, (max-width:960px) 45vw, 432px':'(max-width:520px) calc(100vw - 32px), (max-width:800px) calc((100vw - 58px) / 2), (max-width:1100px) calc((93.2vw - 272px) / 2), (max-width:1440px) calc((93.2vw - 331px) / 2), 500px';
      const variantes=detalle?`${base}-800.webp 800w, ${src} 1200w`:`${base}-480.webp 480w, ${base}-800.webp 800w`;
      return `<img class="${clase}" sizes="${sizes}" srcset="${variantes}" src="${src}" width="1200" height="800" alt="" loading="${detalle?'eager':'lazy'}" decoding="async"><span class="foto-ilustrativa">Imagen ilustrativa</span>`;
    };
    let guardados=new Set();
    try{const saved=JSON.parse(localStorage.getItem('a-domicilio-favoritos-v1')||'[]');if(Array.isArray(saved))guardados=new Set(saved.filter(x=>typeof x==='string'));}catch(_){}
    const claveGuardado=(g,r)=>g.id+':'+r.id;
    const corazon=lleno=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="${lleno?'currentColor':'none'}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/></svg>`;
    const dialogProducto=$('platillo-dialog');let productoActual=-1,entradaProductoPropia=false,animacionCierre=null;
    function guardarProducto(){const g=gente[indicePersona],r=g.recomendaciones[productoActual];if(!r)return;const clave=claveGuardado(g,r),antes=guardados.has(clave);if(antes)guardados.delete(clave);else guardados.add(clave);try{localStorage.setItem('a-domicilio-favoritos-v1',JSON.stringify([...guardados]));}catch(_){}
      const b=$('guardar-producto');b.setAttribute('aria-pressed',!antes);b.innerHTML=corazon(!antes)+(antes?'Guardar para '+g.persona.n:'Guardado para '+g.persona.n);$('producto-mensaje').textContent=antes?'El platillo se retiró de los favoritos de '+g.persona.n+'.':'El platillo quedó guardado entre los favoritos de '+g.persona.n+' en este dispositivo.';
      document.querySelectorAll(`[data-producto="${productoActual}"] .producto-guardado`).forEach(el=>{el.hidden=antes;});
      if(!menosMovimiento()&&!antes)b.animate([{transform:'scale(1)'},{transform:'scale(1.035)'},{transform:'scale(1)'}],{duration:240,easing:'ease-out'});
    }
    function renderProducto(k){
      const g=gente[indicePersona],r=g.recomendaciones[k];if(!r)return;productoActual=k;
      const valor=afinidad(k),personal=g.resumen.pedidos>0,guardado=guardados.has(claveGuardado(g,r)),frecuencia=g.resumen.cocinas.find(([c])=>c===r.cocina),longitud=2*Math.PI*45;
      $('platillo-contenido').innerHTML=`
        <div class="producto-interior">
          <div class="producto-nav"><span class="producto-sello">A domicilio · ${k+1} de 10</span><button class="producto-cerrar" data-cerrar-producto aria-label="Cerrar platillo">×</button></div>
          <div class="producto-hero">${imagenProducto(r,'',true)}<span class="producto-etiqueta">${cocina(r.cocina)}</span></div>
          <div class="producto-cuerpo">
            <div class="producto-heading"><div><p class="etiqueta kicker">${r.tipo==='conocido'?'Un lugar que '+g.persona.n+' ya conoce':'Un lugar para descubrir'}</p><h2 id="producto-titulo" class="producto-titulo" tabindex="-1">${etiquetaPlato(r)}</h2></div><span class="producto-orden">#${k+1}<small>en su menú</small></span></div>
            <div class="producto-para">${avatarPersona(g.persona.n,'producto-avatar')}<p>En la mesa de <strong>${g.persona.n}</strong><span>${GRUPOS[g.perfil].nombre}</span></p></div>
            <section class="producto-motivos" aria-labelledby="producto-por-que">
              <h3 id="producto-por-que" class="producto-pregunta">¿Por qué aparece para ${g.persona.n}?</h3>
              <div class="producto-motivo"><span>${icono(r.tipo==='conocido'?'historial':'grafo')}</span><div><h3>${motivoTitulo(r)}</h3><p>${razonPersonaje(g,r)}</p></div></div>
              ${frecuencia?`<div class="producto-motivo"><span>${comida(r.cocina)}</span><div><h3>Un sabor que aparece en su historia</h3><p>${g.persona.n} tiene ${miles(frecuencia[1])} ${frecuencia[1]===1?'pedido anterior':'pedidos anteriores'} de cocina «${cocina(r.cocina)}».</p></div></div>`:''}
              ${!personal?'<p class="producto-sin-historia">Todavía no hay pedidos anteriores para conocer sus gustos. Su menú empieza por los lugares más pedidos recientemente.</p>':''}
            </section>
            <div class="producto-acciones">
              <button class="producto-guardar" id="guardar-producto" aria-pressed="${guardado}">${corazon(guardado)}${guardado?'Guardado para '+g.persona.n:'Guardar para '+g.persona.n}</button>
              <p id="producto-mensaje" role="status" aria-live="polite">${guardado?'El platillo está guardado para '+g.persona.n+' en este dispositivo.':'Se guarda para '+g.persona.n+' en este dispositivo. Esta demo no realiza pedidos.'}</p>
            </div>
            <section class="producto-afinidad afinidad-secundaria" aria-label="${valor}% de ${personal?'afinidad':'prioridad'} ilustrativa, según su puesto en el menú">
              <div class="afinidad-circulo" aria-hidden="true"><svg viewBox="0 0 110 110"><circle class="afinidad-fondo" cx="55" cy="55" r="45"/><circle class="afinidad-trazo" cx="55" cy="55" r="45" style="--largo:${longitud};--destino:${longitud*(1-valor/100)}"/></svg><strong>${valor}<small>%</small></strong></div>
              <div><span class="afinidad-demo">Indicador visual · demo</span><h3>${personal?'Afinidad ilustrativa':'Prioridad ilustrativa'}</h3><p>Representa su puesto <strong>#${k+1}</strong> en el menú. ${personal?'No es una probabilidad de que le guste.':'Sin pedidos anteriores, todavía no es una afinidad personal.'}</p></div>
            </section>
            <details class="producto-metodo"><summary>Datos de esta recomendación</summary>
              <p>${razonDetalle(g,r)}</p>
              <dl class="producto-fuente"><dt>Restaurante</dt><dd>${r.id}</dd><dt>Zona</dt><dd>${r.zona||'No disponible'}</dd><dt>Pedidos en entrenamiento</dt><dd>${miles(r.pedidos_train)}</dd></dl>
              <p>${personal?'Las opciones consideran la última zona conocida y sus ocho vecinas.':'Las opciones parten de la popularidad reciente de todo el catálogo. No se usa la ubicación de pedidos futuros.'}</p>
              <p>El porcentaje usa la escala ilustrativa <strong>98 − 3 × (posición − 1)</strong>. Solo representa el orden de las sugerencias; no es una probabilidad calculada de preferencia.</p>
              <p>Se recomiendan restaurantes, identificados aquí por su producto más pedido. La foto es una representación generada del platillo; no procede del restaurante real.</p>
            </details>
            <div class="producto-paginacion"><button data-producto-anterior ${k===0?'disabled':''}>Anterior</button><span>${k+1} de 10 opciones</span><button data-producto-siguiente ${k===9?'disabled':''}>Siguiente</button></div>
          </div>
        </div>`;
      dialogProducto.scrollTop=0;
      if(!menosMovimiento())$('platillo-contenido').animate([{opacity:.5,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.2,.7,.2,1)'});
    }

    function abrirProducto(k,actualizar=true){if(!gente[indicePersona].recomendaciones[k])return;cancelaScroll();if(animacionCierre){animacionCierre.cancel();animacionCierre=null;}dialogProducto.classList.remove('cerrando');const estabaAbierto=dialogProducto.open;renderProducto(k);if(!estabaAbierto)dialogProducto.showModal();if(!menosMovimiento()&&!estabaAbierto)dialogProducto.animate([{opacity:0,transform:'translateY(28px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:260,easing:'cubic-bezier(.16,1,.3,1)'});$('producto-titulo').focus({preventScroll:true});
      if(actualizar){const hash=`#demo/${indicePersona}/${vista}/platillo/${k}`;if(estabaAbierto)history.replaceState(null,'',hash);else{history.pushState(null,'',hash);entradaProductoPropia=true;}}
    }
    function cerrarProductoVisual(inmediato=false){if(!dialogProducto.open)return;const indiceAlCerrar=productoActual;const terminar=()=>{dialogProducto.close();dialogProducto.classList.remove('cerrando');animacionCierre=null;entradaProductoPropia=false;document.querySelector(`.reco-abrir[data-platillo="${indiceAlCerrar}"]`)?.focus({preventScroll:true});};
      if(inmediato||menosMovimiento()){animacionCierre?.cancel();terminar();return;}if(animacionCierre)return;dialogProducto.classList.add('cerrando');const anim=dialogProducto.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(20px)'}],{duration:180,easing:'ease-in',fill:'forwards'});animacionCierre=anim;anim.finished.then(()=>{terminar();anim.cancel();}).catch(()=>{});
    }
    function cerrarProducto(){if(entradaProductoPropia&&location.hash.includes('/platillo/'))history.back();else{if(location.hash.includes('/platillo/'))history.replaceState(null,'',`#demo/${indicePersona}/${vista}`);cerrarProductoVisual();}}
    dialogProducto.addEventListener('cancel',e=>{e.preventDefault();cerrarProducto();});
    dialogProducto.addEventListener('click',e=>{if(e.target===dialogProducto||e.target.closest('[data-cerrar-producto]'))cerrarProducto();else if(e.target.closest('#guardar-producto'))guardarProducto();else if(e.target.closest('[data-producto-anterior]'))abrirProducto(productoActual-1);else if(e.target.closest('[data-producto-siguiente]'))abrirProducto(productoActual+1);});

    function tarjetasRecomendaciones(g){
      const nombra=etiquetaPlato;
      return g.recomendaciones.map((r,k)=>`<article class="reco-card tarjeta-producto ${r.tipo} ${revelado&&r.acierto?'coincide':''}" data-producto="${k}">
        <button class="reco-abrir" data-platillo="${k}" aria-label="Ver ${nombra(r)} para ${g.persona.n}, opción ${k+1}"><span class="reco-foto">${imagenProducto(r)}<span class="reco-rango">${String(k+1).padStart(2,'0')}</span></span><span class="reco-nombre"><span class="reco-cocina">${cocina(r.cocina)}</span><span class="nombre-platillo">${nombra(r)}</span></span></button>
        <div class="reco-cuerpo"><div class="reco-info"><span class="tipo-reco ${r.tipo==='conocido'?'familiar':'descubrir'}">${r.tipo==='conocido'?'Ya lo conoce':'Para descubrir'}</span><span class="producto-guardado" ${guardados.has(claveGuardado(g,r))?'':'hidden'}>${corazon(true)} Guardado</span></div>
          <div class="reco-razon"><p>${razonPersonaje(g,r)}</p></div>
          ${revelado?`<p class="coincidencia ${r.acierto?'si':'no'}">${r.acierto?'✓ Estaba entre sus siguientes elecciones':'Sin pedido posterior observado en este lugar'}</p>`:''}
          <button class="reco-ver" data-platillo="${k}" aria-label="Por qué ${nombra(r)} aparece para ${g.persona.n}, opción ${k+1}">Por qué aparece para ${g.persona.n}</button>
        </div>
      </article>`).join('');
    }

    function desenlace(g){
      const v=g.realidad,n=g.persona.n;
      if(!v.objetivos)return `No hay elecciones posteriores de ${n} en estos datos.`;
      if(v.objetivos===1)return `${n} eligió un lugar en los siguientes 15 días. ${v.aciertos?'Ese lugar ya estaba entre sus diez sugerencias.':'Esta vez, ese lugar no estaba entre sus sugerencias.'}`;
      if(!v.aciertos)return `${n} eligió ${miles(v.objetivos)} lugares en los siguientes 15 días. Esta vez, ninguno estaba entre sus sugerencias.`;
      return `De los ${miles(v.objetivos)} lugares que ${n} eligió en los siguientes 15 días, ${v.aciertos===1?'uno ya estaba':miles(v.aciertos)+' ya estaban'} entre sus diez sugerencias.`;
    }
    function renderPaneles(){
      const g=gente[indicePersona],t=tipos(g),v=g.realidad,porcentaje=v.objetivos?Math.round(100*v.aciertos/v.objetivos):0;
      $('panel-recomendaciones').innerHTML=`
        <div class="panel-encabezado"><div><p class="etiqueta kicker">Su siguiente antojo</p><h2>Diez opciones para ${g.persona.n}.</h2></div><p>${g.resumen.pedidos?'Su historia es el punto de partida para este menú.':'Su primer menú parte de lugares populares recientes.'} Abre un platillo para saber por qué aparece.</p></div>
        <div class="composicion-lista" aria-label="Qué hay en su menú"><div><strong>${t.conocidos}</strong><span>${t.conocidos===1?'lugar conocido':'lugares conocidos'}</span></div><div><strong>${t.nuevos}</strong><span>por descubrir</span></div><div><strong>${t.cocinas}</strong><span>${t.cocinas===1?'tipo de cocina':'tipos de cocina'}</span></div></div>
        <div class="lista-y-contexto"><div class="recomendaciones-grid">${tarjetasRecomendaciones(g)}</div><aside class="contexto-motor">
          <section class="contexto-sabores"><p class="etiqueta">Las primeras pistas</p><h3>Los sabores de ${g.persona.n}.</h3>${gustos(g)}<button class="volver-personajes" data-vista="historial">Conocer su historia</button></section>
          <section class="contexto-invitacion"><p class="etiqueta">La historia continúa</p><h3>¿Y qué eligió después?</h3><p>Las sugerencias se prepararon antes de conocer sus siguientes pedidos. Ahora es posible compararlos.</p><button class="btn" data-vista="resultado">Ver qué eligió después</button></section>
          <p class="nota-imagenes">Las fotos son ilustrativas. Cada platillo representa un restaurante de la lista.</p>
        </aside></div>
        <div class="siguiente-capitulo"><div><p class="etiqueta kicker">15 días después</p><h3>Su siguiente elección ya tiene historia.</h3></div><button class="btn comprobar-final" data-vista="resultado">Ver qué eligió después</button></div>`;
      $('panel-historial').innerHTML=`
        <div class="panel-encabezado"><div><p class="etiqueta kicker">Lo que ya conoce</p><h2>${g.resumen.pedidos?'Cada pedido cuenta<br>una historia.':'Su historia está<br>por empezar.'}</h2></div><p>${g.resumen.pedidos?'Estos son los lugares más pedidos de '+g.persona.n+'. Sus favoritos ayudan a entender qué le gusta volver a elegir.':'Todavía no hay pedidos anteriores de '+g.persona.n+' para conocer sus gustos. Su primer menú parte de lugares populares recientes.'}</p></div>
        ${resumenHistorial(g)}
        <div class="historia-layout"><section>${g.resumen.pedidos?`<div class="seccion-etiqueta"><h3>${g.historial.length===1?'Su lugar más pedido':'Sus '+g.historial.length+' lugares más pedidos'}</h3><span>Una mirada a sus favoritos</span></div>`:''}${favoritos(g)}</section>
          <aside class="contexto-motor"><section class="contexto-sabores"><p class="etiqueta">Sus cocinas principales</p><h3>El sabor de su historia.</h3>${gustos(g)}</section><section class="historia-aprendizaje"><p class="etiqueta">Su forma de pedir</p><h3>${GRUPOS[g.perfil].pregunta}</h3><p>${GRUPOS[g.perfil].descripcion}</p><button class="volver-personajes" data-vista="recomendaciones">Explorar su menú</button></section></aside>
        </div>
        <details class="historia-datos"><summary>Sobre este resumen</summary><p>Se muestran los lugares más pedidos disponibles. Es un resumen de sus pedidos anteriores, no una secuencia de fechas.</p><p>${miles(g.resumen.candidatos_en_zona)} restaurantes podían formar parte de sus sugerencias según las reglas del caso. El método completo está en «Cómo funciona esta demo».</p></details>`;
      $('panel-resultado').innerHTML=`
        <div class="resultado-hero"><div><div class="resultado-persona">${avatarPersona(g.persona.n,'resultado-avatar')}<p class="etiqueta">15 días después</p></div><h2>¿Qué eligió<br>${g.persona.n} después?</h2><p>${desenlace(g)}</p></div><div class="resultado-numero"><strong>${v.aciertos}<span> / ${v.objetivos}</span></strong><p>${v.aciertos===1?'lugar elegido que ya estaba':'lugares elegidos que ya estaban'} en su menú</p><div class="resultado-pista" aria-hidden="true"><i style="width:${porcentaje}%"></i></div></div></div>
        <div class="resultado-resumen"><div><b>${g.recomendaciones.length}</b><span>sugerencias en su menú</span></div><div><b>${v.objetivos}</b><span>${v.objetivos===1?'lugar que eligió':'lugares que eligió'}</span></div><div><b>${v.aciertos}</b><span>${v.aciertos===1?'ya estaba en el menú':'ya estaban en el menú'}</span></div></div>
        <div class="panel-encabezado resultado-titulo"><div><p class="etiqueta kicker">Sus siguientes antojos</p><h2>Los lugares que eligió.</h2></div><p>${v.pidio.length<v.objetivos?`Aquí aparecen ${v.pidio.length} de sus ${v.objetivos} lugares posteriores disponibles. La cifra anterior incluye todas sus elecciones.`:'Estos son los lugares observados en sus siguientes pedidos.'}</p></div>
        <div class="observados-grid">${v.pidio.map(r=>{const coincide=g.recomendaciones.some(x=>x.id===r.id);return `<article class="observado ${coincide?'observado-acierto':''}"><span class="comida-icono">${comida(r.cocina)}</span><div><p class="reco-cocina">${cocina(r.cocina)}</p><h3>${etiquetaPlato(r)}</h3><span class="observado-chip">${coincide?'✓ Ya estaba en su menú':'Eligió otro lugar'}</span></div></article>`;}).join('')}</div>
        <div class="resultado-aprendizaje"><span>${icono(v.aciertos?'historial':'grafo')}</span><div><h3>${v.aciertos?'Una parte de su siguiente historia ya estaba en la lista.':'Esta vez, su elección fue por otro camino.'}</h3><p>${v.aciertos?'Las sugerencias coincidieron con parte de lo que '+g.persona.n+' eligió después.':'Las sugerencias no coincidieron con las siguientes elecciones de '+g.persona.n+'. '+(g.resumen.pedidos?'Sus favoritos no explican cada nuevo antojo.':'Conocer sus primeros gustos sigue siendo el reto.')}</p><p>La persona no vio esta lista. Esta comparación no demuestra que las sugerencias cambien sus decisiones ni sus ventas.</p></div></div>
        ${grupoContexto(g)}
        <button class="btn resultado-volver" data-vista="recomendaciones">Volver a su menú</button>`;
      document.querySelectorAll('.demo-tabs [role=tab]').forEach(b=>{const activo=b.dataset.vista===vista;b.setAttribute('aria-selected',activo);b.tabIndex=activo?0:-1;});
      for(const nombre of ['recomendaciones','historial','resultado'])$('panel-'+nombre).hidden=nombre!==vista;
    }

    function mostrar(destino='elegir',i=indicePersona,tab='recomendaciones',push=true,foco=false){cancelaScroll();const cambiaPantalla=pantalla!==destino,cambiaPersona=indicePersona!==i,comienza=destino==='detalle'&&pantalla==='elegir',scrollAntes=$('modo-demo').scrollTop;indicePersona=Math.max(0,Math.min(i,gente.length-1));grupo=gente[indicePersona].perfil;if(comienza)scrollElegir=scrollAntes;pantalla=destino;vista=['recomendaciones','historial','resultado'].includes(tab)?tab:'recomendaciones';if(cambiaPersona||comienza)revelado=false;if(vista==='resultado')revelado=true;
      $('demo-elegir').hidden=pantalla!=='elegir';$('demo-detalle').hidden=pantalla!=='detalle';
      if(pantalla==='elegir')renderSeleccion();else{perfil(gente[indicePersona]);renderPaneles();}
      if(push)ruta();$('modo-demo').scrollTop=pantalla==='elegir'?scrollElegir:(cambiaPantalla||cambiaPersona?0:scrollAntes);
      entradaSuave(pantalla==='elegir'?$('demo-elegir'):(cambiaPantalla||cambiaPersona?$('demo-detalle'):$('panel-'+vista))); 
      if(foco&&pantalla==='detalle')$('nombre-persona').focus({preventScroll:true});
      if(pantalla==='elegir'&&cambiaPantalla)document.querySelector(`[data-persona="${indicePersona}"]`)?.focus({preventScroll:true});
    }
    function desdeRuta(){const partes=location.hash.slice(1).split('/');if(partes[0]==='demo'){
      cambiaModoSinEvento('demo');const numero=Number(partes[1]),i=Number.isInteger(numero)&&numero>=0&&numero<gente.length?numero:indicePersona,esDetalle=partes.length>1&&Number.isInteger(numero)&&numero>=0&&numero<gente.length,tab=['recomendaciones','historial','resultado'].includes(partes[2])?partes[2]:'recomendaciones',producto=partes[3]==='platillo'&&Number.isInteger(Number(partes[4]))?Number(partes[4]):-1;
      if(dialogProducto.open&&producto<0){cerrarProductoVisual();if(pantalla===(esDetalle?'detalle':'elegir')&&indicePersona===i&&vista===tab)return;}
      if(pantalla!==(esDetalle?'detalle':'elegir')||indicePersona!==i||vista!==tab||!$('perfil-demo').children.length)mostrar(esDetalle?'detalle':'elegir',i,tab,false);
      if(esDetalle&&producto>=0)abrirProducto(producto,false);
    }else{cerrarProductoVisual(true);cambiaModoSinEvento('slides');if(SLIDES.length)pinta((parseInt(partes[0],10)||1)-1,false);}}
    function cambiaModoSinEvento(modo){actualizaModo(modo);}
    $('modo-demo').addEventListener('click',e=>{
      const platillo=e.target.closest('[data-platillo]');if(platillo){abrirProducto(+platillo.dataset.platillo);return;}
      const gr=e.target.closest('[data-grupo]');if(gr){grupo=gr.dataset.grupo;indicePersona=gente.findIndex(g=>g.perfil===grupo);revelado=false;renderSeleccion();entradaSuave($('personas-grupo'),true);entradaSuave($('preview-persona'));desplazaHasta($('seleccion-persona'),{margen:20,alTerminar:()=>$('titulo-grupo').focus({preventScroll:true})});return;}
      const persona=e.target.closest('[data-persona]');if(persona){indicePersona=+persona.dataset.persona;revelado=false;renderSeleccion();entradaSuave($('preview-persona'));document.querySelector(`[data-persona="${indicePersona}"]`).focus({preventScroll:true});return;}
      if(e.target.closest('#ver-recomendaciones')){mostrar('detalle',indicePersona,'recomendaciones',true,true);return;}
      if(e.target.closest('#volver-personajes,[data-cambiar]')){mostrar('elegir');return;}
      const tab=e.target.closest('[data-vista]');if(tab){mostrar('detalle',indicePersona,tab.dataset.vista);document.querySelector(`.demo-tabs [data-vista="${vista}"]`).focus({preventScroll:true});desplazaHasta(document.querySelector('.demo-tabs'),{margen:0,duracion:300});}
    });
    document.querySelector('.demo-tabs').addEventListener('keydown',e=>{const tabs=[...document.querySelectorAll('.demo-tabs [role=tab]')],n=tabs.indexOf(e.target);if(n<0)return;let next=n;if(e.key==='ArrowRight')next=(n+1)%3;else if(e.key==='ArrowLeft')next=(n+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();mostrar('detalle',indicePersona,tabs[next].dataset.vista);document.querySelectorAll('.demo-tabs [role=tab]')[next].focus({preventScroll:true});desplazaHasta(document.querySelector('.demo-tabs'),{margen:0,duracion:300});});
    window.addEventListener('demo:abrir',e=>{if(e.detail.navegar)mostrar('elegir');});
    document.addEventListener('click',e=>{const b=e.target.closest('[data-usuario]');if(b)mostrar('detalle',+b.dataset.usuario,'recomendaciones',true,true);});
    window.addEventListener('hashchange',desdeRuta);
    renderSeleccion();if(location.hash.startsWith('#demo'))desdeRuta();

  }catch(e){$('demo-elegir').innerHTML='<div class="demo-error"><h1>No pudimos poner la mesa.</h1><p>No se pudo cargar demo.json. Comprueba que los datos estén junto a index.html y vuelve a abrir la página.</p></div>';console.error('No se pudo preparar la demo',e);}
})();
