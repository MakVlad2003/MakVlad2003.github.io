(() => {
 'use strict';
 const params=new URL(location.href).searchParams,en=params.get('lang')==='en',lang=en?'en':'ru',doc=params.get('doc');
 const docs={'thesis-slides':['Презентация ВКР','Thesis presentation'],'thesis-text':['Текст ВКР','Thesis text'],'mipt-talk':['Конференция МФТИ · Презентация','MIPT conference · Presentation'],'neurocampus-poster':['Нейрокампус 2025 · Постер','Neurocampus 2025 · Poster']};
 const $=id=>document.getElementById(id),stage=$('stage'),canvas=$('canvas'),status=$('status');
 let data,index=0,zoom=1;
 document.documentElement.lang=lang;
 $('back-link').textContent=en?'Vladislav Makarov':'Владислав Макаров';$('back-link').href=`index.html${en?'?lang=en':''}#talks`;
 const labels={previous:en?'Previous page':'Предыдущая страница',next:en?'Next page':'Следующая страница','zoom-out':en?'Zoom out':'Уменьшить','zoom-in':en?'Zoom in':'Увеличить',fullscreen:en?'Full screen':'На весь экран'};
 for(const [id,label]of Object.entries(labels)){$(id).setAttribute('aria-label',label);$(id).title=label;}
 $('fit').textContent=en?'Fit':'Вписать';status.textContent=en?'Loading material…':'Загрузка материала…';
 function layout(){if(!data)return;const pad=innerWidth<760?24:48,available=Math.max(240,canvas.clientWidth-pad),height=Math.max(220,innerHeight-document.querySelector('.viewer-header').offsetHeight-pad),fit=data.kind==='pages'?Math.min(920,available)/data.width:Math.min(available/data.width,height/data.height);const scale=fit*zoom;stage.style.width=`${data.width*scale}px`;stage.style.height=`${data.height*scale}px`;$('zoom-out').disabled=zoom<=.6;$('zoom-in').disabled=zoom>=3;}
 function show(n){
  if(!data)return;index=Math.max(0,Math.min(data.pages.length-1,n));stage.querySelectorAll('video').forEach(v=>v.pause());
  const page=data.pages[index];stage.replaceChildren();
  const img=document.createElement('img');img.src=`materials/${doc}/${page.image}?v=${data.revision||'2'}`;img.alt=`${$('page-label').textContent} ${index+1}`;img.className='page-image';img.width=data.width;img.height=data.height;
  img.onerror=()=>{status.hidden=false;status.textContent=en?'Could not load the page. Reload to try again.':'Не удалось загрузить страницу. Обновите вкладку.';};stage.append(img);
  for(const item of page.videos){const v=document.createElement('video');v.src=`materials/${doc}/${item.src}`;v.poster=`materials/${doc}/${item.poster}`;v.controls=true;v.playsInline=true;v.loop=true;v.muted=true;v.autoplay=!matchMedia('(prefers-reduced-motion: reduce)').matches;v.preload='metadata';v.setAttribute('controlsList','nodownload');v.setAttribute('aria-label',en?'Video from the original slide':'Видео из исходного слайда');Object.assign(v.style,{left:`${item.x}%`,top:`${item.y}%`,width:`${item.width}%`,height:`${item.height}%`});stage.append(v);}
  $('page-select').value=String(index);$('previous').disabled=index===0;$('next').disabled=index===data.pages.length-1;
  $('thumbnails').querySelectorAll('button').forEach((b,i)=>{b.setAttribute('aria-current',i===index?'page':'false');if(i===index)b.scrollIntoView({block:'nearest'});});
  const url=new URL(location.href);url.hash=`page=${index+1}`;history.replaceState(null,'',url);canvas.scrollTop=0;layout();
 }
 $('previous').onclick=()=>show(index-1);$('next').onclick=()=>show(index+1);$('page-select').onchange=e=>show(Number(e.target.value));
 $('zoom-out').onclick=()=>{zoom=Math.max(.6,zoom-.2);layout();};$('zoom-in').onclick=()=>{zoom=Math.min(3,zoom+.2);layout();};$('fit').onclick=()=>{zoom=1;layout();};
 $('fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else canvas.requestFullscreen?.();};
 addEventListener('keydown',e=>{if(e.ctrlKey||e.altKey||e.metaKey||['SELECT','INPUT','VIDEO'].includes(e.target.tagName))return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();show(index+1);}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();show(index-1);}});
 addEventListener('resize',layout);addEventListener('fullscreenchange',layout);
 if(!docs[doc]){status.textContent=en?'This material is not available.':'Этот материал недоступен.';document.querySelector('.viewer-controls').hidden=true;return;}
 $('document-title').textContent=docs[doc][en?1:0];document.title=`${$('document-title').textContent} — ${$('back-link').textContent}`;
 fetch(`materials/${doc}/pages.json`).then(r=>{if(!r.ok)throw Error('load');return r.json();}).then(d=>{
  if(!d.pages?.length||!(d.width>0&&d.height>0))throw Error('invalid');data=d;status.hidden=true;
  const unit=d.kind==='pages'?(en?'Page':'Страница'):(en?'Slide':'Слайд');$('page-label').textContent=unit;$('page-select').setAttribute('aria-label',en?'Select page':'Выбрать страницу');$('thumbnails').setAttribute('aria-label',en?'Pages':'Страницы');$('page-total').textContent=`/ ${d.pages.length}`;
  d.pages.forEach((p,i)=>{const opt=document.createElement('option');opt.value=i;opt.textContent=i+1;$('page-select').append(opt);const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`${unit} ${i+1}`);b.innerHTML=`<img src="materials/${doc}/${p.image}?v=${data.revision||'2'}" loading="lazy" alt=""><span>${i+1}${p.videos.length?(en?' · video':' · видео'):''}</span>`;b.onclick=()=>show(i);$('thumbnails').append(b);});
  show(Number(location.hash.match(/page=(\d+)/)?.[1]||1)-1);
 }).catch(()=>{status.hidden=false;status.textContent=en?'Could not open this material. Reload to try again.':'Не удалось открыть материал. Обновите вкладку, чтобы попробовать снова.';});
})();
