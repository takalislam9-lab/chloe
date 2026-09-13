#!/usr/bin/env python3
"""Generate elegant, on-brand editorial sample images (SVG) for CHLOE.
Duotone 'fashion magazine' treatment + line-art motif per service."""
import os

import os
BASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "images")

# palettes: (grad_top, grad_bottom, line_color, accent)
PALETTES = {
    "cream": ("#F3ECE1", "#E2D0B4", "#B08D57", "#8A6D42"),
    "ink":   ("#2E2924", "#4A3F35", "#D8B4A6", "#B08D57"),
    "nude":  ("#ECD5CA", "#D8B4A6", "#26221E", "#8A5E4C"),
    "sand":  ("#EFE7DA", "#D6C4A8", "#6B5B4C", "#B08D57"),
    "olive": ("#E7E4D6", "#CBC2A6", "#6B5B4C", "#8A6D42"),
    "rose":  ("#F0DAD3", "#E2B9AC", "#7A4A3C", "#B08D57"),
}

# ---- line-art motifs (drawn on a 400x500 canvas, stroke uses currentColor) ----
def scissors():
    return '''
    <g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round">
      <circle cx="150" cy="330" r="34"/><circle cx="250" cy="330" r="34"/>
      <path d="M170 300 L300 150"/><path d="M230 300 L100 150"/>
      <path d="M300 150 q22 -10 30 -30" stroke-width="5"/>
      <path d="M100 150 q-22 -10 -30 -30" stroke-width="5"/>
    </g>'''

def waves():  # flowing hair / color
    return '''
    <g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity="0.95">
      <path d="M110 90 C60 180 240 210 150 320 C90 400 250 400 200 470"/>
      <path d="M170 80 C120 180 300 210 210 320 C150 400 310 400 260 470"/>
      <path d="M230 90 C180 180 360 210 270 320 C210 400 360 400 320 470"/>
    </g>'''

def straighten():  # alisado - straight sleek strands
    return '''
    <g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round">
      <path d="M130 80 C150 140 140 220 150 470"/>
      <path d="M175 80 C195 150 185 240 195 470"/>
      <path d="M220 80 C240 150 230 240 240 470"/>
      <path d="M265 80 C285 140 275 220 285 470"/>
      <path d="M110 110 q100 -40 200 0" stroke-width="6"/>
    </g>'''

def lips():  # makeup
    return '''
    <g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M120 250 C160 210 190 245 200 255 C210 245 240 210 280 250
               C255 300 215 330 200 330 C185 330 145 300 120 250 Z"/>
      <path d="M120 250 C170 265 230 265 280 250"/>
    </g>
    <g fill="currentColor" opacity="0.85">
      <circle cx="315" cy="150" r="4"/><circle cx="95" cy="360" r="4"/>
    </g>'''

def updo():  # peinado de evento
    return '''
    <g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round">
      <path d="M120 300 C120 190 280 190 280 300"/>
      <ellipse cx="200" cy="180" rx="70" ry="55"/>
      <path d="M150 150 q50 -55 100 0" />
      <path d="M170 300 l0 60 M230 300 l0 60"/>
    </g>
    <g stroke="currentColor" stroke-width="4"><path d="M300 210 l40 -25 M310 250 l45 -5"/></g>'''

def polish():  # uñas - nail polish bottle + sparkle
    return '''
    <g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <rect x="150" y="230" width="100" height="150" rx="16"/>
      <rect x="172" y="150" width="56" height="80" rx="8"/>
      <path d="M188 150 l0 -34 l24 0 l0 34"/>
    </g>
    <g stroke="currentColor" stroke-width="4" stroke-linecap="round">
      <path d="M110 140 l0 40 M90 160 l40 0"/>
      <path d="M300 300 l0 30 M285 315 l30 0"/>
    </g>'''

def brow():  # cejas / microblading - eye + arched brow
    return '''
    <g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M120 230 q80 -55 160 -8" stroke-width="10"/>
      <path d="M120 300 q80 60 160 0"/>
      <path d="M120 300 q80 -55 160 0"/>
      <circle cx="200" cy="300" r="24"/>
    </g>
    <g stroke="currentColor" stroke-width="3">
      <path d="M135 210 l14 -18 M175 196 l8 -20 M220 196 l6 -20 M262 208 l16 -18"/>
    </g>'''

def face():  # portrait profile for team / hero
    return '''
    <g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M255 120 C300 150 300 210 285 250 C300 260 300 285 280 290
               C280 340 250 380 200 385 C150 385 130 340 135 290
               C110 250 120 160 190 130 C215 118 240 112 255 120 Z"/>
      <path d="M150 300 q50 30 110 5"/>
      <circle cx="185" cy="235" r="4" fill="currentColor"/>
    </g>'''

MOTIFS = {"scissors": scissors, "waves": waves, "straighten": straighten,
          "lips": lips, "updo": updo, "polish": polish, "brow": brow, "face": face}

def label_svg(text, palette, motif, w=800, h=1000, tag=""):
    top, bot, line, acc = PALETTES[palette]
    m = MOTIFS[motif]()
    tagblock = ""
    if tag:
        tagblock = f'''
      <g transform="translate(40,900)">
        <text x="0" y="0" font-family="Georgia, 'Playfair Display', serif" font-size="34"
              fill="{line}" opacity="0.9">{tag}</text>
        <line x1="2" y1="18" x2="150" y2="18" stroke="{acc}" stroke-width="2"/>
      </g>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bot}"/>
    </linearGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer>
      <feComposite operator="over" in2="SourceGraphic"/></filter>
  </defs>
  <rect width="400" height="500" fill="url(#g)"/>
  <g opacity="0.28" fill="{acc}">
    <circle cx="60" cy="70" r="120"/><circle cx="360" cy="440" r="90"/>
  </g>
  <g color="{line}" opacity="0.9">{m}</g>
  <rect width="400" height="500" filter="url(#grain)" opacity="0.6"/>
  <rect x="14" y="14" width="372" height="472" fill="none" stroke="{line}" stroke-width="1.5" opacity="0.45"/>
</svg>'''

# ---- portfolio (matches content/portfolio.json order) ----
PORTFOLIO = [
    ("look-01", "waves",      "cream", "Balayage"),
    ("look-02", "straighten", "ink",   "Alisado"),
    ("look-03", "lips",       "rose",  "Maquillaje"),
    ("look-04", "updo",       "sand",  "Peinados"),
    ("look-05", "polish",     "nude",  "Uñas"),
    ("look-06", "brow",       "olive", "Cejas"),
]
os.makedirs(f"{BASE}/portfolio", exist_ok=True)
for name, motif, pal, tag in PORTFOLIO:
    open(f"{BASE}/portfolio/{name}.svg", "w").write(label_svg(tag, pal, motif, tag=tag))

# ---- team ----
os.makedirs(f"{BASE}/team", exist_ok=True)
open(f"{BASE}/team/jessica.svg", "w").write(label_svg("", "cream", "face"))
open(f"{BASE}/team/geri.svg", "w").write(label_svg("", "nude", "face"))

# ---- hero side image (portrait) ----
open(f"{BASE}/hero.svg", "w").write(label_svg("", "ink", "waves"))

# ---- og cover (wide) ----
def og_cover():
    top, bot, line, acc = PALETTES["cream"]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bot}"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g opacity="0.25" fill="{acc}"><circle cx="1050" cy="120" r="220"/><circle cx="120" cy="560" r="160"/></g>
  <text x="80" y="300" font-family="Georgia,'Playfair Display',serif" font-size="88" fill="#26221E">CHLOE<tspan fill="{acc}">.</tspan></text>
  <text x="84" y="360" font-family="Georgia,serif" font-size="34" fill="{line}">Peluquería &amp; Estética Unisex · Alcobendas</text>
  <text x="84" y="410" font-family="Arial,Helvetica,sans-serif" font-size="24" fill="#6B5B4C" letter-spacing="3">CALLE DEL FUEGO 46 · RESERVA EN BOOKSY</text>
</svg>'''
open(f"{BASE}/og-cover.svg", "w").write(og_cover())

print("Generated:", len(PORTFOLIO), "portfolio +", 2, "team + hero + og")
