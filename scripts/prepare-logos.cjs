/* Deterministic conversion of supplied official logos to transparent PNG.
   Never alters source files or redraws brand geometry. */
const sharp=require('/Users/vld_mkrv/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs=require('fs');
const sources=[
 ['fcmn-supplied','/Users/vld_mkrv/Downloads/Логотип_ФЦМН_РФ.png','white'],
 ['ccm-supplied','/Users/vld_mkrv/Downloads/HlH-nOaIRQE1_phwK3XoIe7HR3IQfxMRTwC-VVXUY0IHazv1a5zUnomOLyWF3kSunHpoy7KQB4vqcDmx6GdFexYr.jpg','white'],
 ['lyceum239-supplied','/Users/vld_mkrv/Downloads/SSHdyoZhD8A.jpg','black'],
 ['mipt-supplied','/Users/vld_mkrv/Downloads/Hv_full_no_bg.png',null]
];
(async()=>{
 for(const [name,src,bg] of sources){
  const {data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  if(bg)for(let i=0;i<data.length;i+=4){
   const [r,g,b,a]=data.subarray(i,i+4);
   const value=bg==='white'?255-Math.min(r,g,b):Math.max(r,g,b);
   const coverage=Math.min(1,Math.max(0,(value-8)/30));
   data[i+3]=Math.round(a*coverage);
  }
  const png=await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).png().toBuffer();
  await sharp(png).trim({background:'#00000000',threshold:5}).resize({width:480,height:480,fit:'inside',withoutEnlargement:true}).png().toFile(`assets/logos/${name}.png`);
 }
 await sharp('/Users/vld_mkrv/Downloads/logo_conf_neurocamp.svg').resize({width:470}).png().toFile('assets/logos/neurocampus-supplied.png');
})();
