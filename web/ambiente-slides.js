'use strict';
// Decorative surfaces and a few deliberate presentation beats.
const AMBIENTE_SLIDES=(()=>{
  const reducir=matchMedia('(prefers-reduced-motion: reduce)');
  let animaciones=[],salidaActual=null,circularActual=null,secuencia=0;
  const clasesPorSlide={2:'ambiente-plato',3:'ambiente-limpio',5:'salto-propuesta',6:'ambiente-mesa entrada-lista',7:'ambiente-comedor',8:'ambiente-huerta entrada-lista entrada-lenta',9:'entrada-pasos entrada-lenta',10:'salto-demo',12:'ambiente-citricos',13:'ambiente-plato',15:'ambiente-mosaico-marco',16:'ambiente-oliva',17:'ambiente-piloto entrada-lista entrada-lenta'};
  const limon=`<svg viewBox="0 0 180 180" aria-hidden="true"><path d="M97 40C95 13 123 4 150 12C142 39 120 51 97 40Z" fill="#729943"/><path d="m99 40 37-20" fill="none" stroke="#173e2e" stroke-width="4"/><circle cx="88" cy="104" r="65" fill="#f4cf48"/><circle cx="88" cy="104" r="54" fill="#fff8e5"/><circle cx="88" cy="104" r="47" fill="#f4cf48"/><path d="M88 57V151M41 104H135M55 71 121 137M55 137 121 71" stroke="#fff8e5" stroke-width="5"/><circle cx="88" cy="104" r="7" fill="#fff8e5"/></svg>`;
  const tomate=`<svg viewBox="0 0 180 180" aria-hidden="true"><path d="M29 80C17 50 55 28 84 48C114 22 160 45 157 80C180 129 136 167 91 163C35 172 6 125 29 80Z" fill="#bd4333"/><path d="m84 58-32-21 28 2 10-27 10 29 32-14-19 30 24 14-36-3-7 28-12-27-29 11Z" fill="#173e2e"/><path d="M37 95C30 122 45 143 65 147" fill="none" stroke="#de803d" stroke-width="9" stroke-linecap="round"/></svg>`;
  const hojas=`<svg viewBox="0 0 180 180" aria-hidden="true"><path d="M92 156C10 151 7 81 16 52C73 57 99 96 92 156ZM96 154C80 83 118 28 165 16C175 80 152 135 96 154Z" fill="#729943"/><path d="M95 165 44 84m51 81 50-109M65 118l-31-8m45 30-9-29m44 11 29-13m-17-13-3-27" fill="none" stroke="#fff8e5" stroke-width="4" stroke-linecap="round"/></svg>`;
  const mosaico=()=>`<div class="decoracion decor-mosaico" aria-hidden="true"><img data-decor src="img/mosaico-mercado.webp" srcset="img/mosaico-mercado-640.webp 640w, img/mosaico-mercado.webp 960w" sizes="100vw" width="960" height="640" alt="" loading="lazy" decoding="async" fetchpriority="low"></div>`;
  const ingrediente=(svg,clase)=>`<span class="ingrediente ${clase}">${svg}</span>`;
  const huerta=clase=>`<div class="decoracion decor-bodegon ${clase}">${ingrediente(hojas,'ramita')}${ingrediente(tomate,'tomate')}${ingrediente(limon,'citrico')}</div>`;
  const patronComida=()=>`<div class="decoracion decor-patron-comida">${Array.from({length:3},()=>'<img data-decor src="img/patron-comida.webp" srcset="img/patron-comida-640.webp 640w, img/patron-comida.webp 960w" sizes="(max-width:900px) 50vw, 33vw" width="960" height="640" alt="" loading="lazy" decoding="async" fetchpriority="low">').join('')}</div>`;
  function decoracion(i){
    let html='';
    if([2,13].includes(i))html+='<div class="decoracion decor-plato"></div><div class="decoracion decor-plato decor-plato-superior"></div>';
    if([6,17].includes(i))html+='<div class="decoracion decor-mantel"></div>';
    if(i===7)html+=patronComida()+'<div class="decoracion decor-vajilla"></div>'+huerta('bodegon-comedor');
    if(i===12)html+='<div class="decoracion decor-patron-citricos"><img data-decor src="img/patron-citricos.svg" width="1200" height="800" alt="" loading="lazy" decoding="async" fetchpriority="low"></div>';
    if(i===15)html+=mosaico()+huerta('bodegon-acuerdo');
    if(i===16)html+=`<div class="decoracion decor-oliva">${ingrediente(hojas,'ramita')}${ingrediente(hojas,'ramita-segunda')}${ingrediente(limon,'citrico')}</div>`;
    if(i===17)html+=huerta('bodegon-piloto');
    if([5,10].includes(i))html+=`<span class="semilla-transicion ${i===5?'semilla-amarilla':'semilla-azul'}" aria-hidden="true"></span>`;
    return html?`<div class="ambiente-capa decoracion" aria-hidden="true">${html}</div>`:'';
  }
  function quitaSalida(){
    if(!salidaActual)return;
    const {elemento,style,inert}=salidaActual;
    elemento.classList.remove('salida-circular');
    if(style===null)elemento.removeAttribute('style');else elemento.setAttribute('style',style);
    elemento.inert=inert;salidaActual=null;
  }
  function cancelar(){
    secuencia++;animaciones.splice(0).forEach(a=>a.cancel());quitaSalida();
    if(circularActual){circularActual.classList.remove('entrada-circular');circularActual=null;}
  }
  function capturar(elemento){
    if(!elemento)return null;
    const r=elemento.getBoundingClientRect(),seed=elemento.querySelector('.semilla-transicion')?.getBoundingClientRect();
    return {elemento,rect:{left:r.left,top:r.top,width:r.width,height:r.height},seed:seed?{x:seed.left+seed.width/2,y:seed.top+seed.height/2,r:seed.width/2}:null,style:elemento.getAttribute('style'),inert:elemento.inert};
  }
  function lista(slide,retardo=0){
    const selector=slide.classList.contains('entrada-lista')?'.tarjetas > .tarjeta':slide.classList.contains('entrada-pasos')?'.timeline > .periodo':null;
    if(!selector)return;
    const lenta=slide.classList.contains('entrada-lenta'),duracion=lenta?750:420,intervalo=lenta?750:180;
    slide.querySelectorAll(selector).forEach((el,i)=>animaciones.push(el.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:duracion,delay:retardo+i*intervalo,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'})));
  }
  function entrar(slide,anterior,actual,salida){
    if(reducir.matches||!slide||typeof slide.animate!=='function')return;
    const esCirculo=salida?.seed&&((anterior===5&&actual===6)||(anterior===10&&actual===11));
    if(!esCirculo){lista(slide);return;}
    const run=secuencia;
    try{
      slide.classList.add('entrada-circular');circularActual=slide;
      const r=slide.getBoundingClientRect(),stage=document.getElementById('escenario').getBoundingClientRect();
      const x=salida.seed.x-r.left,y=salida.seed.y-r.top;
      const radio=Math.max(Math.hypot(x,y),Math.hypot(r.width-x,y),Math.hypot(x,r.height-y),Math.hypot(r.width-x,r.height-y))+2;
      salidaActual=salida;const el=salida.elemento;
      el.classList.add('salida-circular');el.inert=true;
      Object.assign(el.style,{left:(salida.rect.left-stage.left)+'px',top:(salida.rect.top-stage.top)+'px',width:salida.rect.width+'px',height:salida.rect.height+'px',margin:'0'});
      const anim=slide.animate([{clipPath:`circle(${salida.seed.r}px at ${x}px ${y}px)`},{clipPath:`circle(${radio}px at ${x}px ${y}px)`}],{duration:620,easing:'cubic-bezier(.22,.7,.2,1)',fill:'both'});
      animaciones.push(anim);
      [...slide.children].filter(el=>!el.matches('.decoracion,.semilla-transicion,.folio')).forEach(el=>animaciones.push(el.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,delay:240,easing:'ease-out',fill:'backwards'})));
      lista(slide,200);
      anim.finished.then(()=>{if(run===secuencia){quitaSalida();anim.cancel();}}).catch(()=>{});
    }catch(_){cancelar();}
  }
  reducir.addEventListener?.('change',e=>{if(e.matches)cancelar();});
  window.addEventListener('resize',cancelar);
  document.addEventListener('fullscreenchange',cancelar);
  return {clases:i=>clasesPorSlide[i]||'',decoracion,cancelar,capturar,entrar};
})();
