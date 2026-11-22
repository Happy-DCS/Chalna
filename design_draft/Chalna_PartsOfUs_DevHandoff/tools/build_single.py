#!/usr/bin/env python3
"""src/index.html + src/assets/ → dist/Chalna_PartsOfUs.html (이미지를 모두 base64로 넣은 단일 파일)
사용법:  python tools/build_single.py   (Python 3.8+, 추가 설치 없음)
- index.html 안에서 따옴표·괄호·&quot; 바로 뒤에 오는 assets/... 경로만 data URI로 바꿉니다.
- 웹폰트(Cardo, Pinyon Script, Pretendard)는 CDN에서 불러오므로 인터넷 연결이 필요합니다."""
import base64, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / 'src', ROOT / 'dist' / 'Chalna_PartsOfUs.html'
MIME = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp'}
html = (SRC / 'index.html').read_text(encoding='utf-8')
cache, missing = {}, set()
def data_uri(path):
    if path not in cache:
        f = SRC / path
        if not f.exists():
            missing.add(path); return path
        cache[path] = f'data:{MIME[f.suffix[1:].lower()]};base64,' + base64.b64encode(f.read_bytes()).decode()
    return cache[path]
pat = re.compile(r'(["\'(]|&quot;)(assets/[\w./-]+\.(?:jpe?g|png|webp))')
out = pat.sub(lambda m: m.group(1) + data_uri(m.group(2)), html)
OUT.parent.mkdir(exist_ok=True)
OUT.write_text(out, encoding='utf-8')
print(f'built {OUT}  ({OUT.stat().st_size/1e6:.1f} MB, {len(cache)} images)')
if missing: print('MISSING:', *sorted(missing), sep='\n  ')
