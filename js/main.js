// Reads the album data from data.js, builds the page and runs the scroll effects.
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),ss=t=>t*t*(3-2*t);
const T={morning:['#060608','#ecebf3','255,200,150'],midday:['#03060a','#e8f0f8','110,170,255'],golden:['#0a0503','#f7e4c8','255,125,40'],night:['#010102','#d8dcec','120,140,220']};
const LENS=[.706,.449]; // phone camera position inside the selfie (fraction of width, height)
const I=D.imgs,all=[],total=D.chapters.reduce((n,c)=>n+c.photos.length,0);

/* content */
$$('[data-name]').forEach(e=>e.textContent=D.name);document.title=D.name+' | Photography';
$('#lead').textContent=D.lead;$('#about-p').textContent=D.about;
$('#intro-h').textContent=D.introTitle;$('#intro-p').textContent=D.intro;
$('#count').textContent=`${total} photographs in ${D.chapters.length} chapters`;
$('#rv').style.setProperty('--hero',`url("${I[D.hero].src}")`);$('#rv').setAttribute('aria-label',I[D.hero].alt);
$('#me').src=I[D.me].src;
$('#nav').innerHTML=D.chapters.map(c=>`<a href="#${c.id}">${c.name}</a>`).join('');
$('#toc').innerHTML=D.chapters.map(c=>`<a href="#${c.id}"><span>${c.name}</span><span>${c.photos.length} photographs</span></a>`).join('');
$('#main').innerHTML=D.chapters.map(c=>{
 const figs=c.photos.map(id=>{const m=I[id];all.push({src:m.src,alt:m.alt});
  return `<figure class="f"><button data-i="${all.length-1}" aria-label="Open photo: ${m.alt}"><div class="fr" style="aspect-ratio:${m.w}/${m.h}"><img src="${m.src}" width="${m.w}" height="${m.h}" alt="${m.alt}" loading="lazy"><i class="gl"></i></div></button><figcaption>${m.alt}</figcaption></figure>`}).join('');
 return `<section class="chap" id="${c.id}" data-t="${c.id}" data-n="${c.name}"><div class="chap-h"><h2>${c.name}</h2><p>${c.line}</p><small>${c.photos.length} photographs</small></div><div class="cols">${figs}</div></section>`}).join('');

/* reveal, theme and nav state */
const figs=$$('.f'),io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
figs.forEach(f=>io.observe(f));
function theme(el){const t=T[el.dataset.t],r=document.documentElement.style;
 if(t){r.setProperty('--bg',t[0]);r.setProperty('--fg',t[1]);r.setProperty('--sun',t[2])}
 if(el.dataset.n)$('#lbl').textContent=el.dataset.n;
 $$('#nav a').forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')==='#'+el.id))}
const tio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)theme(e.target)}),{rootMargin:'-50% 0px -50% 0px'});
$$('[data-t]').forEach(s=>tio.observe(s));

/* opening: fit the selfie to any screen so the phone lens stays in view */
const open=$('#top'),stage=$('#stage'),sel=$('#sel'),sw=$('#sw'),rv=$('#rv'),rvi=$('#rvi'),st=$('#st'),cue=$('#cue'),ring=$('#ring'),me=$('#me'),sun=$('#sun'),lbl=$('#lbl');
let lx=0,ly=0,maxR=0;
function fit(){
 const W=sel.clientWidth,H=sel.clientHeight,m=I[D.me],s=Math.max(W/m.w,H/m.h),w=m.w*s,h=m.h*s,land=W>H;
 const l=cl(W*(land?.66:.58)-LENS[0]*w,W-w,0),t=cl(H*(land?.42:.36)-LENS[1]*h,H-h,0);
 me.style.cssText=`width:${w}px;height:${h}px;left:${l}px;top:${t}px`;
 lx=l+LENS[0]*w;ly=t+LENS[1]*h;maxR=Math.hypot(Math.max(lx,W-lx),Math.max(ly,H-ly))+4;
 sw.style.transformOrigin=`${lx}px ${ly}px`;
 ring.style.left=lx+'px';ring.style.top=ly+'px';ring.style.width=ring.style.height=Math.max(34,s*80)+'px'}

/* scroll: lens opens into the first photo, sun path, photo parallax */
let tick=false;
function frame(){
 tick=false;const vh=innerHeight,vw=innerWidth,max=document.documentElement.scrollHeight-vh,sp=max>0?Math.min(scrollY/max,1):0;
 const y=60-45*Math.sin(sp*Math.PI*.85),x=78-sp*52;
 sun.style.transform=`translate(${x*vw/100-sun.offsetWidth/2}px,${y*vh/100-sun.offsetHeight/2}px)`;
 if(rm)return;
 const span=open.offsetHeight-stage.clientHeight,p=span>0?cl(scrollY/span):1;
 if(scrollY<open.offsetHeight)lbl.textContent=p>.55?'Portfolio':'Behind the camera';
 sw.style.transform=`scale(${1+1.4*ss(cl(p/.85))})`;
 rv.style.clipPath=`circle(${(maxR*ss(cl((p-.12)/.75))).toFixed(1)}px at ${lx}px ${ly}px)`;
 st.style.opacity=1-cl(p/.22);cue.style.opacity=1-cl(p/.12);ring.style.opacity=1-cl(p/.3);rvi.style.opacity=cl((p-.72)/.22);
 figs.forEach(f=>{const r=f.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;
  const k=((r.top+r.height/2)-vh/2)/vh;f.querySelector('img').style.setProperty('--py',(-k*r.height*.06).toFixed(1)+'px')})}
function req(){if(!tick){tick=true;requestAnimationFrame(frame)}}
function relayout(){fit();req()}
addEventListener('scroll',req,{passive:true});addEventListener('resize',relayout);addEventListener('orientationchange',relayout);
me.addEventListener('load',relayout);fit();frame();
document.addEventListener('pointermove',e=>{const fr=e.target.closest&&e.target.closest('.fr');if(!fr)return;const b=fr.getBoundingClientRect();fr.style.setProperty('--mx',(e.clientX-b.left)+'px');fr.style.setProperty('--my',(e.clientY-b.top)+'px')});

/* full-screen viewer */
const lb=$('#lb'),li=lb.querySelector('img');let cur=0;
function show(i){cur=(i+all.length)%all.length;li.src=all[cur].src;li.alt=all[cur].alt;$('#ct').textContent=`${cur+1} / ${all.length}`;$('#cap').textContent=all[cur].alt}
$('#main').addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(b){show(+b.dataset.i);lb.showModal()}});
lb.querySelector('.x').onclick=()=>lb.close();
lb.querySelector('.pv').onclick=()=>show(cur-1);lb.querySelector('.nx').onclick=()=>show(cur+1);
lb.addEventListener('click',e=>{if(e.target===lb)lb.close()});
lb.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1)});
