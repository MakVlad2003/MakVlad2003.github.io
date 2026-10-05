"""Refresh browser asset URLs before committing a website update."""
from pathlib import Path
import hashlib
import re
root = Path(__file__).resolve().parent.parent
# PDF versions change with the uploaded document, not with browser cache state.
content = root / 'content.js'
text = content.read_text()
page = root / 'index.html'
html = page.read_text()
for pdf in ['main_rus.pdf', 'main_eng.pdf']:
    version = hashlib.sha256((root / pdf).read_bytes()).hexdigest()[:12]
    pattern = re.escape(pdf) + r'(?:\?v=[a-f0-9]+)?'
    text = re.sub(pattern, pdf + '?v=' + version, text)
    html = re.sub(pattern, pdf + '?v=' + version, html)
content.write_text(text)
page.write_text(html)
for name, assets in [('index.html', ['styles.css', 'content.js', 'app.js']), ('viewer.html', ['viewer.css', 'viewer.js'])]:
    page = root / name
    text = page.read_text()
    for asset in assets:
        version = hashlib.sha256((root / asset).read_bytes()).hexdigest()[:12]
        pattern = r'((?:href|src)=")' + re.escape(asset) + r'(?:\?v=[^" ]+)?(")'
        text = re.sub(pattern, lambda match: match[1] + asset + '?v=' + version + match[2], text)
    page.write_text(text)
