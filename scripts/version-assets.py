"""Refresh browser asset URLs before committing a website update."""
from pathlib import Path
import hashlib
import re
root = Path(__file__).resolve().parent.parent
for name, assets in [('index.html', ['styles.css', 'content.js', 'app.js']), ('viewer.html', ['viewer.css', 'viewer.js'])]:
    page = root / name
    text = page.read_text()
    for asset in assets:
        version = hashlib.sha256((root / asset).read_bytes()).hexdigest()[:12]
        pattern = r'((?:href|src)=")' + re.escape(asset) + r'(?:\?v=[^" ]+)?(")'
        text = re.sub(pattern, lambda match: match[1] + asset + '?v=' + version + match[2], text)
    page.write_text(text)
