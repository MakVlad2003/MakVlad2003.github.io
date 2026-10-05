"""Build fixed browser pages from native PDF exports and restore embedded PPTX video.
Requires bundled soffice and Poppler. Never changes the author’s source files.
"""
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as E
import re,json,posixpath,subprocess
from concurrent.futures import ThreadPoolExecutor
base=Path(__file__).resolve().parent.parent
sources={'thesis-slides':'ВКР_Макаров_final.pptx','mipt-talk':'МФТИ_Конференция.pptx','thesis-text':'Макаров_Диплом_final.docx','neurocampus-poster':'Макаров_постер_2025.pdf'}
ns={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
manifest={}
def build(pair):
 doc,name=pair;out=base/'materials'/doc;out.mkdir(exist_ok=True)
 native_thesis=base/'figure/ВКР_Макаров_final.pdf'
 native_text=base/'figure/Макаров_Диплом_final.pdf'
 pdf=native_thesis if doc=='thesis-slides' and native_thesis.exists() else native_text if doc=='thesis-text' and native_text.exists() else base/'figure'/'МФТИ_Конференция.pdf' if doc=='mipt-talk' else base/'figure'/name if name.endswith('.pdf') else base/'materials/rendered'/(Path(name).stem+'.pdf')
 subprocess.run(['pdftoppm','-jpeg','-jpegopt','quality=91','-scale-to','2200' if doc=='thesis-text' else '1920',str(pdf),str(out/'page')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
 from PIL import Image
 images=sorted(out.glob('page-*.jpg'),key=lambda x:int(re.search(r'page-(\d+)',x.name)[1]))
 pages=[{'image':f.name,'videos':[]} for f in images];width,height=Image.open(images[0]).size
 if name.endswith('.pptx'):
  with ZipFile(base/'figure'/name) as z:
   pres=E.fromstring(z.read('ppt/presentation.xml'));size=pres.find('p:sldSz',ns);sw,sh=int(size.get('cx')),int(size.get('cy'))
   for i,page in enumerate(pages,1):
    part=f'ppt/slides/slide{i}.xml';root=E.fromstring(z.read(part));rels={r.get('Id'):posixpath.normpath(posixpath.join('ppt/slides',r.get('Target'))) for r in E.fromstring(z.read(f'ppt/slides/_rels/slide{i}.xml.rels'))}
    for j,pic in enumerate(root.findall('.//p:pic',ns)):
     video=pic.find('.//a:videoFile',ns)
     if video is None:continue
     media=next((e for e in pic.iter() if e.tag.endswith('}media')),None)
     asset=rels[media.get('{'+ns['r']+'}embed')] if media is not None else rels[video.get('{'+ns['r']+'}link')]
     trim=next((e for e in pic.iter() if e.tag.endswith('}trim')),None)
     start=int(trim.get('st','0'))/1000 if trim is not None else 0
     xfrm=pic.find('p:spPr/a:xfrm',ns);off=xfrm.find('a:off',ns);ext=xfrm.find('a:ext',ns)
     path=out/f'video-{i}-{j}.mp4';raw=out/f'raw-{i}-{j}.mp4';raw.write_bytes(z.read(asset))
     crop=pic.find('p:blipFill/a:srcRect',ns);l,t,r,b=[int(crop.get(k,'0'))/100000 if crop is not None else 0 for k in ['l','t','r','b']]
     vf=f'crop=iw*{1-l-r}:ih*{1-t-b}:iw*{l}:ih*{t},scale=trunc(iw/2)*2:trunc(ih/2)*2'
     subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(start),'-i',str(raw),'-vf',vf,'-c:v','libx264','-preset','fast','-crf','22','-c:a','aac','-movflags','+faststart',str(path)],check=True)
     raw.unlink()
     poster=out/(path.stem+'.jpg');subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(path),'-frames:v','1',str(poster)],check=True)
     page['videos'].append({'src':path.name,'poster':poster.name,'x':int(off.get('x'))/sw*100,'y':int(off.get('y'))/sh*100,'width':int(ext.get('cx'))/sw*100,'height':int(ext.get('cy'))/sh*100})
 data={'renderSource':str(pdf.relative_to(base)),'revision':str(pdf.stat().st_mtime_ns),'source':'figure/'+name,'width':width,'height':height,'kind':'pages' if doc=='thesis-text' else 'slides','pages':pages}
 (out/'pages.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
 return doc,{'source':data['source'],'pages':len(pages),'videos':sum(len(x['videos']) for x in pages)}
with ThreadPoolExecutor(max_workers=3) as pool:
 for doc,info in pool.map(build,sources.items()):manifest[doc]=info;print(doc,info,flush=True)
(base/'materials/manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
