(() => {
  'use strict';
  const content = window.CV_CONTENT;
  const external = 'target="_blank" rel="noopener noreferrer"';
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
  const social = [['MIPT','mailto:makarov.vd@phystech.edu'],['GitHub','https://github.com/MakVlad2003'],['Telegram','https://t.me/vld_mkrv'],['ORCID','https://orcid.org/0009-0006-6239-879X'],['Scholar','https://scholar.google.com/citations?user=_KmTHCEAAAAJ&hl=en'],['LinkedIn','https://www.linkedin.com/in/vladislav-makarov-1b64803b3']];
  const publications = [
    {title:'SceneGraphVLM: Dynamic Scene Graph Generation from Video with Vision-Language Models',authors:'<strong>V. Makarov</strong>, M. Gizetdinov, D. Yudin',source:'arXiv · 2026',image:'assets/publications/scenegraphvlm.png',url:'https://arxiv.org/abs/2605.13667',pdf:'https://arxiv.org/pdf/2605.13667'},
    {title:'GraphSeqLoc: Image Sequence-Based Place Recognition via Scene Graphs and Temporal Re-Ranking',authors:'E. Pinkin, G. Kartashov, M. Kalmykov, <strong>V. Makarov</strong>, A. Melekhin, D. Yudin',source:'SSRN · 2026',image:'assets/publications/graphseqloc.png',url:'https://ssrn.com/abstract=7422535'}
  ];
  const main = document.getElementById('main');
  let revealObserver;
  const icons = {
    scholar:'<path d="m2 9 10-6 10 6-10 6zM6 12v5c3 3 9 3 12 0v-5M22 9v8"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    github:'<path style="fill:currentColor;stroke:none" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
    telegram:'<path d="m3 11 18-7-4 16-6-5-3 3 1-6 8-5-10 5z"/>',
    orcid:'<circle cx="12" cy="12" r="9"/><path d="M8 10v7m0-10v.1M12 10h2a3.5 3.5 0 0 1 0 7h-2z"/>',
    linkedin:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m0-10v.1m5 10v-7m0 3c0-4 5-4 5 0v4"/>',
    file:'<path d="M14 3H6v18h12V7zM14 3v5h4M9 12h6m-6 4h6"/>',
    slides:'<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M12 17v4m-4 0h8M7 9h10m-10 4h6"/>',
    link:'<path d="m10 13 4-4m-5 7-2 2a4 4 0 0 1-5-5l4-4a4 4 0 0 1 5 0m2-1 2-2a4 4 0 0 1 5 5l-4 4a4 4 0 0 1-5 0"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1"/><path d="m3 17 6-6 4 4 4-5 4 7"/>'
  };
  const icon = key => `<svg class="resource-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]||icons.link}</svg>`;
  const resourceIcon = (label,url) => icon(url.includes('github.com')?'github':/slides|talk|[Пп]резентац|[Pp]resentation/.test(label+url)?'slides':/poster|постер|figure|рисунок/.test(label+url)?'image':/arxiv|ssrn|PDF|ВКР|[Pp]aper|[Dd]iploma|[Дд]иплом/.test(label+url)?'file':'link');
  const paperVisual = index => {
    const p=publications[index];
    return p.image?`<figure class="paper-visual"><a href="${p.image}" ${external} aria-label="${lang==='ru'?'Открыть рисунок метода':'Open method figure'}"> <img src="${p.image}" alt="${p.title} — ${lang==='ru'?'схема метода из статьи':'method overview from the paper'}" loading="lazy"></a></figure>`:'';
  };
  function observeReveals() {
    revealObserver?.disconnect();
    if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let nextReveal=0;
    revealObserver=new IntersectionObserver(items=>{
      items.filter(item=>!item.isIntersecting).forEach(item=>{
        if(item.boundingClientRect.bottom<=0||item.boundingClientRect.top>=innerHeight){
          item.target.classList.remove('reveal-visible');
          item.target.classList.add('reveal-pending');
        }
      });
      const visible=items.filter(item=>item.isIntersecting)
        .sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
      const now=performance.now();
      visible.forEach(item=>{
        if(!item.target.classList.contains('reveal-pending'))return;
        const delay=Math.min(360,Math.max(0,nextReveal-now));
        item.target.style.setProperty('--reveal-delay',`${delay}ms`);
        item.target.style.setProperty('--reveal-offset',item.boundingClientRect.top<innerHeight/2?'-32px':'32px');
        item.target.classList.remove('reveal-pending');
        item.target.classList.add('reveal-visible');
        nextReveal=now+delay+130;
      });
    },{threshold:0});
    main.querySelectorAll('.intro h1, .portrait, .hero-about > p, .intro-actions, .intro-social, .content-section > h2, .content-section > article, .contact-icons, .footer').forEach(el=>{
      if(el.getBoundingClientRect().top>=innerHeight)el.classList.add('reveal-pending');
      revealObserver.observe(el);
    });
  }
  main.addEventListener('focusin',event=>{
    const target=event.target.closest('.reveal-pending, .reveal-visible');
    if(target){target.classList.remove('reveal-pending','reveal-visible');revealObserver?.unobserve(target);}
  });
  const navigation = document.getElementById('navigation');
  let lang = new URL(location.href).searchParams.get('lang') === 'en' ? 'en' : 'ru';
  let theme = 'dark';
  try {theme = localStorage.getItem('cv-theme') === 'light' ? 'light' : 'dark';} catch (_) {}
  let activeSection = 'about';
  const opened = new Set();
  const socialLinks = (compact=false) => `<div class="social-links ${compact?'contact-icons':''}">${social.map(([label,url])=>`<a href="${url}" ${url.startsWith('https:')?external:''} aria-label="${label==='MIPT'?'makarov.vd@phystech.edu':label}" title="${label==='MIPT'?'makarov.vd@phystech.edu':label}">${icon(label==='MIPT'?'mail':label.toLowerCase())}<span>${label==='MIPT'?content[lang].miptEmail:label}</span></a>`).join('')}</div>`;
  const details = (id,label,body) => `<details class="reveal-details" data-detail="${id}" ${opened.has(id)?'open':''}><summary>${label}</summary><div class="detail-body">${body}</div></details>`;
  const resources = items => items?`<div class="resource-links">${items.map(([label,url])=>`<a href="${url}" ${external}>${resourceIcon(label,url)}${label}</a>`).join('')}</div>`:'';
  const logo = (name,label) => name?`<span class="org-logo logo-${name.split('.')[0]}"><img src="assets/logos/${name}" alt="${label}" loading="lazy"></span>`:'';
  const entries = (items,group) => items.map((item,i)=>`<article class="entry ${group==='talk'?'conference-entry':''}"><div class="entry-time">${logo(item.logo,item.title)}${item.date.map(line=>`<span>${line}</span>`).join('')}</div><div class="entry-copy"><div class="org-heading"><div><h3>${item.url?`<a class="entry-title-link" href="${item.url}" ${external}>${item.title}</a>`:item.title}</h3>${item.meta?`<p class="entry-meta">${item.meta}</p>`:''}</div></div>${item.position?`<p class="entry-position"><span>${content[lang].positionLabel}:</span> <strong>${item.position}</strong></p>`:''}${item.text?`<p>${item.text}</p>`:''}${item.supervisors?`<p class="entry-supervisors">${item.supervisors}</p>`:''}${item.result?`<span class="result">${item.result}</span>`:''}${resources(item.resources)}${item.detail?details(`${group}-${i}`,content[lang].details,item.detail):''}</div></article>`).join('');
  const section = (id,title,body,extra='') => `<section class="content-section ${extra}" id="${id}" aria-labelledby="${id}-title"><h2 id="${id}-title">${title}</h2>${body}</section>`;
  navigation.addEventListener('click',event=>{const link=event.target.closest('a');if(link)activate(link.hash.slice(1));});
  function activate(id) {
    activeSection=id;
    navigation.querySelectorAll('a').forEach(link=>{if(link.hash===`#${id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  }
  function updateTheme() {
    document.documentElement.dataset.theme=theme;
    const label=content[lang][theme==='dark'?'themeLight':'themeDark'];
    const button=document.getElementById('theme-toggle');
    button.setAttribute('aria-label',label);button.title=label;button.setAttribute('aria-pressed',String(theme==='dark'));
  }
  function render() {
    const c=content[lang];
    document.documentElement.lang=lang;document.title=c.title;
    document.querySelector('.wordmark').innerHTML=`<span class="wordmark-first">${c.name[0]} </span><strong>${c.name[1]}</strong>`;
    document.querySelector('meta[name="description"]').content=c.description;
    document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===lang)));
    const cv=document.getElementById('header-cv');cv.href=c.cv;cv.setAttribute('aria-label',`${c.download} (PDF)`);document.getElementById('header-cv-label').textContent=c.download;
    navigation.setAttribute('aria-label',c.navLabel);navigation.innerHTML=c.nav.map(([id,label])=>`<a href="#${id}">${label}</a>`).join('');
    document.getElementById('sidebar-note').innerHTML=c.sidebar;
    const intro=`<section class="intro" id="about" aria-labelledby="name"><div class="intro-copy"><h1 id="name">${c.name.join(' ')}</h1><div class="hero-about about-copy" id="bio">${c.about.map(p=>`<p>${p}</p>`).join('')}</div><div class="intro-actions"><a class="primary-link" href="#projects">${c.viewWork}${arrow}</a><a class="text-link" href="#contact">${c.getInTouch}${arrow}</a></div></div><figure class="portrait"><img src="assets/portrait.png" width="851" height="994" alt="${c.name.join(' ')}" fetchpriority="high"></figure><div class="intro-social">${socialLinks()}</div></section>`;
    const projects=c.projects.map(p=>`<article class="research-project"><div class="project-context">${logo(p.logo,'Sber Robotics')}<span>${p.meta}</span><span>${p.date.join(' ')}</span></div><div class="project-copy"><h3>${p.title}</h3><p>${p.text}</p></div></article>`).join('');
    const papers=publications.map((p,i)=>`<article class="publication">${paperVisual(i)}<div class="publication-copy"><div class="publication-meta">${p.source}</div><h3><a class="entry-title-link" href="${p.url}" ${external}>${p.title}</a></h3><p class="authors">${p.authors}</p>${resources([[c.paperLink,p.url],...(p.pdf?[[c.paperPdf,p.pdf]]:[])])}</div></article>`).join('');
    const competitionLabels=lang==='ru'?['Задача','Моя роль','Результат']:['Task','My role','Result'];
    const competitions=items=>items.map(i=>`<article class="competition"><time>${i.year}</time><div><h3>${i.title}</h3><p class="competition-kind">${i.kind}</p><dl>${[i.text,i.role,i.result].map((v,j)=>`<div><dt>${competitionLabels[j]}</dt><dd>${v}</dd></div>`).join('')}</dl>${resources(i.resources)}</div></article>`).join('');
    const olympiads=c.olympiads.map(item=>`<article class="competition olympiad"><time datetime="${item.year}">${item.year}</time><div><h3><a class="entry-title-link" href="${item.url}" ${external}>${item.title}</a> · ${item.subject}</h3><p class="competition-kind">${item.meta}</p><p class="olympiad-result">${item.result}</p>${resources(item.resources)}<p class="olympiad-code">${c.diplomaCodeLabel}: <span>${item.code}</span></p></div></article>`).join('');
    main.innerHTML=intro+section('experience',c.experienceTitle,entries(c.experience,'experience'))
      +section('projects',c.projectsTitle,projects,'projects-section')
      +section('publications',c.publicationsTitle,papers)
      +section('talks',c.talksTitle,entries(c.talks,'talk'))+section('education',c.educationTitle,entries(c.education,'education'))
      +section('hackathons',lang==='ru'?'Хакатоны':'Hackathons',competitions(c.competitions.slice(0,3)))
      +section('cases',lang==='ru'?'Кейс-чемпионаты':'Case competitions',competitions(c.competitions.slice(3)))
      +section('olympiads',c.olympiadsTitle,olympiads)
      +section('contact',c.contactTitle,socialLinks(true),'contact-section')
      +`<footer class="footer"><span>© 2026 ${c.name.join(' ')}</span><a href="#about">${c.backTop}${arrow}</a></footer>`;
    updateTheme();activate(activeSection);
    main.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',()=>{if(el.open)opened.add(el.dataset.detail);else opened.delete(el.dataset.detail);}));
    updateProgress();observeReveals();
  }
  function updateProgress() {
    let current='about';
    const side=navigation.parentElement;
    const threshold=getComputedStyle(side).position==='sticky'?109+side.offsetHeight+24:document.querySelector('.site-header').offsetHeight+32;
    document.documentElement.style.setProperty('--header',`${threshold-32}px`);
    for(const [id] of content[lang].nav)if(document.getElementById(id).getBoundingClientRect().top<=threshold)current=id;
    if(scrollY>0&&scrollY+innerHeight>=document.documentElement.scrollHeight-3)current='contact';
    activate(current);
    const max=document.documentElement.scrollHeight-innerHeight;
    document.getElementById('progress').style.width=`${max>0?Math.min(100,scrollY/max*100):0}%`;
  }
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{
    if(lang===button.dataset.lang)return;
    const id=activeSection,offset=document.getElementById(id).getBoundingClientRect().top;
    lang=button.dataset.lang;const url=new URL(location.href);
    if(lang==='en')url.searchParams.set('lang','en');else url.searchParams.delete('lang');history.replaceState(null,'',url);
    render();
    const next=document.getElementById(id);
    next.classList.remove('reveal-pending','reveal-visible');
    document.documentElement.style.scrollBehavior='auto';
    const restore=()=>window.scrollTo(0,Math.max(0,scrollY+next.getBoundingClientRect().top-offset));
    restore();
    requestAnimationFrame(()=>{restore();document.documentElement.style.scrollBehavior='';updateProgress();});
  }));
  document.getElementById('theme-toggle').addEventListener('click',()=>{theme=theme==='light'?'dark':'light';updateTheme();try{localStorage.setItem('cv-theme',theme);}catch(_){}});
  let pending=false;
  addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{updateProgress();pending=false;});},{passive:true});
  addEventListener('resize',updateProgress);
  render();
  if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
})();
