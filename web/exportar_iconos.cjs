// Optional: regenerate the standalone SVGs and the visual catalogue after editing iconos.js.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=__dirname;
const icons=vm.runInNewContext(fs.readFileSync(path.join(root,'iconos.js'),'utf8')+';ICONOS_ADOMICILIO;');
const dir=path.join(root,'img/iconos');
fs.mkdirSync(dir,{recursive:true});
let cards='';
for(const [key,label] of Object.entries(icons.labels)){
  const svg=icons.svg(key);
  fs.writeFileSync(path.join(dir,key+'.svg'),svg.replace('aria-hidden="true"','role="img" aria-label="'+label+'"'));
  cards+=`<figure>${svg}<figcaption>${label}</figcaption></figure>`;
}
fs.writeFileSync(path.join(root,'catalogo-iconos.html'),`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Iconos — A domicilio</title><link rel="icon" href="favicon.ico" sizes="16x16 32x32 48x48 64x64"><link rel="icon" type="image/svg+xml" href="favicon.svg"><link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png"><style>
@font-face{font-family:DM;src:url(fonts/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxhTg.ttf)}@font-face{font-family:Barlow;src:url(fonts/HTxwL3I-JCGChYJ8VI-L6OO_au7B46r2_3E.ttf);font-weight:700}
*{box-sizing:border-box}body{margin:0;background:#fff8e5;color:#173e2e;font-family:DM,Arial,sans-serif}main{max-width:1100px;margin:auto;padding:45px 35px 40px}.marca{font-weight:bold;font-size:15px}.marca b{display:inline-grid;place-items:center;background:#bd4333;color:#fff8e5;width:32px;height:32px;border-radius:50%;margin-right:10px;font-size:25px}h1{font-family:Barlow,Impact,sans-serif;font-size:52px;text-transform:uppercase;margin:22px 0 10px;line-height:1}header>p{font-size:13px;margin:0 0 25px;line-height:1.5}section{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}figure{margin:0;display:grid;justify-items:center;align-content:center;gap:10px;min-height:140px;padding:15px 8px;background:#f1eedf;border-radius:12px}figure:nth-child(4n+2){background:#e8edda}figure:nth-child(4n+3){background:#eee4ce}figure:nth-child(4n){background:#e5e9f1}svg{display:block;width:82px;height:82px}figcaption{font-size:11px;font-weight:bold;text-align:center}footer{margin-top:24px;font-size:10px;line-height:1.5;color:#52614e}@media(max-width:700px){main{padding:25px 16px}h1{font-size:40px}section{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}figure{min-height:122px}svg{width:68px;height:68px}figcaption{font-size:10px}}
</style><main><header><div class="marca"><b>a.</b>A domicilio</div><h1>Pequeños antojos.<br>Identidad en cada detalle.</h1><p>Una familia de 23 ilustraciones: formas recortadas, color y alimentos que se reconocen.</p></header><section aria-label="Familia de iconos">${cards}</section><footer>20 ilustraciones de comida · 3 ilustraciones para historial, conexiones y zona.<br>SVG originales y editables · A domicilio, 2026</footer></main></html>`);
console.log('Exportados '+Object.keys(icons.labels).length+' SVG y catalogo-iconos.html');
