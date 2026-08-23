from pathlib import Path
import re, shutil, zipfile, html

ROOT=Path('/mnt/data/linva_work')
LOCATIONS=[
'New Town','Rajarhat','Salt Lake','Bidhannagar','EM Bypass','Kasba','Garia','Behala','Joka','Tollygunge','Jadavpur','Chinar Park','Kestopur','Baguiati','Dum Dum','Dum Dum Cantonment','Lake Town','VIP Road','Jessore Road','Madhyamgram','Barasat','Barrackpore','Khardaha','Baranagar','Nagerbazar','North Dum Dum','Howrah','Shibpur','Santragachi','Bally','Liluah','Andul Road','Domjur','Maheshtala','Uttarpara','Konnagar','Serampore','Rishra','Chandannagar','Chinsurah','Naihati','Panihati','Kamarhati','New Barrackpore','Narendrapur','Rajpur-Sonarpur','Baruipur','Budge Budge','Diamond Harbour Road','Alipore','New Alipore'
]
assert len(LOCATIONS)==51

def slug(s):
    s=s.lower().replace('&','and')
    s=re.sub(r"[^a-z0-9]+",'-',s).strip('-')
    return s

def footer(prefix=''):
    # Four columns on desktop, two on mobile. Every location is visible in the footer.
    groups=[LOCATIONS[0:13],LOCATIONS[13:26],LOCATIONS[26:39],LOCATIONS[39:]]
    cols=[]
    for i,g in enumerate(groups,1):
        links=''.join(f'<li><a href="{prefix}locations/{slug(x)}.html">{html.escape(x)}</a></li>' for x in g)
        cols.append(f'<div class="footer-location-column"><ul>{links}</ul></div>')
    return f'''<footer>
  <div class="footer-main">
    <img src="{prefix}images/linva-interiors-logo.svg" alt="Linva Interiors">
    <p>Designing spaces, enhancing lives.</p>
    <a href="tel:+918961698488">8961698488</a>
    <span>Kolkata • Howrah • New Town • Rajarhat</span>
    <div class="contact-links">
      <a class="contact-link" href="mailto:support@linvainteriors.in"><span class="contact-icon" aria-hidden="true">✉</span> support@linvainteriors.in</a>
      <a class="contact-link" href="tel:+918961698488"><span class="contact-icon" aria-hidden="true">☎</span> +91 8961698488</a>
      <a class="contact-link" href="https://wa.me/918961698488" target="_blank" rel="noopener"><img src="{prefix}images/whatsapp-icon.svg" alt="" aria-hidden="true"> WhatsApp Chat</a>
    </div>
  </div>
  <section class="footer-locations" aria-label="Linva Interiors service locations">
    <h2>Interior Design Services <span>Across Kolkata &amp; Surrounding Areas</span></h2>
    <div class="footer-location-grid">{''.join(cols)}</div>
  </section>
  <small>© 2026 Linva Interiors. All Rights Reserved.</small>
</footer>'''

# Update main index: remove body local location links/section; replace SEO copy with general text; add footer.
idx=ROOT/'index.html'
s=idx.read_text(encoding='utf-8')
s=re.sub(r'\s*<div class="local-links">.*?</div>', '', s, flags=re.S)
s=s.replace('Interior Designer in <span>Kolkata & Howrah</span>', 'Interior Designer for <span>Modern Indian Homes</span>')
s=s.replace('Linva Interiors creates personalised residential interiors across Kolkata, Howrah, New Town, Rajarhat and surrounding areas. Explore our design ideas, services and completed projects, then book a free home visit to discuss your space.', 'Linva Interiors creates personalised residential interiors with thoughtful design, practical planning and quality-focused execution. Explore our design ideas, services and completed projects, then book a Free Home Visit to discuss your space.')
s=s.replace('<details><summary>Which areas do you serve?</summary><p>We currently focus on Kolkata, Howrah and surrounding areas including New Town and Rajarhat.</p></details>', '<details><summary>Which areas do you serve?</summary><p>We serve homes across Kolkata, Howrah and the surrounding locations listed in the footer of this website.</p></details>')
# Update location input placeholder so it doesn't imply only 3 areas.
s=s.replace('placeholder="Kolkata / Howrah / New Town"','placeholder="Enter your area / locality"')
# Replace footer from first <footer> to before whatsapp float.
s=re.sub(r'<footer>.*?</footer>', footer(''), s, count=1, flags=re.S)
idx.write_text(s,encoding='utf-8')

# Update Design Ideas hub: no body location section; replace footer with relative paths.
di=ROOT/'design-ideas.html'
s=di.read_text(encoding='utf-8')
s=re.sub(r'<footer>.*?</footer>', footer(''), s, count=1, flags=re.S)
di.write_text(s,encoding='utf-8')

# Update all 9 design category pages with footer relative paths.
for p in (ROOT/'design-ideas').glob('*.html'):
    s=p.read_text(encoding='utf-8')
    s=re.sub(r'<footer>.*?</footer>', footer('../'), s, count=1, flags=re.S)
    p.write_text(s,encoding='utf-8')

# Create 51 location-specific home pages cloned from index.
locdir=ROOT/'locations'
locdir.mkdir(exist_ok=True)
base=idx.read_text(encoding='utf-8')
for loc in LOCATIONS:
    sl=slug(loc)
    page=base
    title=f'Linva Interiors | Interior Designer in {loc}'
    desc=f'Linva Interiors offers residential interior design services in {loc}. Explore home interior ideas, services and projects, and book a Free Home Visit.'
    page=re.sub(r'<title>.*?</title>', f'<title>{html.escape(title)}</title>', page, count=1, flags=re.S)
    page=re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{html.escape(desc, quote=True)}">', page, count=1)
    page=re.sub(r'<link rel="canonical"[^>]*>\s*', '', page)
    page=page.replace('<link rel="stylesheet" href="style.css">','<link rel="stylesheet" href="../style.css">')
    page=page.replace('<link rel="icon" type="image/svg+xml" href="images/linva-interiors-logo.svg">','<link rel="icon" type="image/svg+xml" href="../images/linva-interiors-logo.svg">')
    page=page.replace('<link rel="preload" as="image" href="images/hero-interior.webp">','<link rel="preload" as="image" href="../images/hero-interior.webp">')
    # Change all local asset paths to parent paths.
    for asset in ['images/','design-ideas.html','script.js','social-links.js']:
        if asset=='images/':
            page=page.replace('src="images/','src="../images/').replace('href="images/','href="../images/')
        else:
            page=page.replace(f'href="{asset}"', f'href="../{asset}"').replace(f'src="{asset}"', f'src="../{asset}"')
    # Home nav should return to location home, design ideas remains global.
    page=page.replace('href="#home" aria-label="Linva Interiors home"','href="index.html" aria-label="Linva Interiors home"')
    # Rewrite body SEO section for this location, but keep it as a single location-specific paragraph, not a location list.
    page=re.sub(r'<section class="section seo">.*?</section>', f'''<section class="section seo">\n      <p class="eyebrow dark">LINVA INTERIORS</p>\n      <h2>Interior Designer in <span>{html.escape(loc)}</span></h2>\n      <p>Linva Interiors creates personalised residential interiors for homes in {html.escape(loc)}. From kitchens and bedrooms to living rooms and complete-home interiors, we focus on practical layouts, refined finishes and designs that fit the way you live.</p>\n    </section>''', page, count=1, flags=re.S)
    # Location-specific form hidden field and placeholder.
    page=page.replace('<input type="hidden" name="_captcha" value="true">','<input type="hidden" name="_captcha" value="true">\n        <input type="hidden" name="service_area" value="'+html.escape(loc, quote=True)+'">')
    page=page.replace('placeholder="Enter your area / locality"', f'placeholder="{html.escape(loc)}"')
    # Replace footer with location-aware footer; all footer links are relative from /locations/.
    page=re.sub(r'<footer>.*?</footer>', footer('../'), page, count=1, flags=re.S)
    # Ensure canonical URL is relative-safe; GitHub Pages/custom domain assumed root.
    page=page.replace('</head>', f'<link rel="canonical" href="https://linvainteriors.in/locations/{sl}.html">\n</head>',1)
    (locdir/f'{sl}.html').write_text(page,encoding='utf-8')

# Create a sitemap listing current site pages and all location pages.
urls=['https://linvainteriors.in/','https://linvainteriors.in/design-ideas.html']
urls += [f'https://linvainteriors.in/design-ideas/{slug(p.stem.replace("-designs",""))}-designs.html' for p in (ROOT/'design-ideas').glob('*-designs.html')]
urls += [f'https://linvainteriors.in/locations/{slug(x)}.html' for x in LOCATIONS]
urls=sorted(set(urls))
sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>{u}</loc></url>\n' for u in urls) + '</urlset>\n'
(ROOT/'sitemap.xml').write_text(sitemap,encoding='utf-8')

# Add CSS for footer locations.
css=ROOT/'style.css'
c=css.read_text(encoding='utf-8')
block=r'''
/* ===== LOCATION SEO FOOTER ===== */
.footer-main{display:flex;flex-direction:column;align-items:center}
.footer-locations{width:100%;max-width:1280px;margin:38px auto 0;padding-top:30px;border-top:1px solid rgba(255,255,255,.13);text-align:left}
.footer-locations h2{font-size:20px;line-height:1.2;margin:0 0 22px;color:#fff;text-align:center}
.footer-locations h2 span{color:#e2c37e}
.footer-location-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 28px}
.footer-location-column ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.footer-location-column a{display:block;color:#cfc3ca;font-size:11px;line-height:1.35;text-decoration:none}
.footer-location-column a:hover{color:#fff;text-decoration:underline;text-underline-offset:3px}
@media(min-width:760px){
  .footer-locations{margin-top:48px;padding-top:34px}
  .footer-locations h2{text-align:left;font-size:24px}
  .footer-location-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:28px 44px}
  .footer-location-column ul{gap:9px}
  .footer-location-column a{font-size:12px}
}
'''
if '/* ===== LOCATION SEO FOOTER ===== */' not in c:
    c += block
css.write_text(c,encoding='utf-8')

# Documentation
(ROOT/'LOCATION-SEO-STRUCTURE.txt').write_text('''LINVA INTERIORS LOCATION SEO STRUCTURE\n\nAll 51 location links are placed in the FOOTER only. They are not in the top navigation and not listed in the main homepage body.\n\nEach location link opens its own crawlable location homepage:\n/locations/<location-slug>.html\n\nThe location pages use the same Linva home design but have a location-specific title, meta description, SEO section and form service-area value.\n\nThe homepage and Design Ideas pages retain the location links only in their footer.\n\nSitemap: /sitemap.xml\n''',encoding='utf-8')

# Basic checks
for p in [idx,di,ROOT/'style.css',ROOT/'sitemap.xml']:
    assert p.exists(), p
for loc in LOCATIONS:
    assert (locdir/f'{slug(loc)}.html').exists(), loc
    txt=(locdir/f'{slug(loc)}.html').read_text(encoding='utf-8')
    assert f'Interior Designer in <span>{html.escape(loc)}</span>' in txt
    assert 'support@linvainteriors.in' in txt
    assert 'locations/' in txt
# No location nav item added.
for p in [idx,di]:
    txt=p.read_text(encoding='utf-8')
    assert 'Areas We Serve' not in txt
# Main body should not contain the local-links list.
assert 'class="local-links"' not in idx.read_text(encoding='utf-8')

# Package
out=Path('/mnt/data/Linva-Interiors-V12-Footer-Locations-51-Pages.zip')
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for p in ROOT.rglob('*'):
        if p.is_file():
            z.write(p,p.relative_to(ROOT))
print(out)
print('locations',len(LOCATIONS))
print('sitemap urls',len(urls))
