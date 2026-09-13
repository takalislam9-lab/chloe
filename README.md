# CHLOE · Peluquería y Estética Unisex (Alcobendas)

Sitio web profesional, estático y autogestionable para **CHLOE Peluquería y Estética Unisex**
— Calle del Fuego, 46, 28100 Alcobendas, Madrid.

Estética de revista de moda (tonos crema, acentos dorados, tipografías serif elegantes),
optimizado para **SEO local** y con un **panel de gestión visual (Decap CMS)** en `/admin`
para que el cliente edite servicios, precios, equipo, porfolio y opiniones **sin tocar código**.

## Stack

- **HTML5** semántico + datos estructurados **JSON-LD** (`HairSalon`) para SEO local.
- **Tailwind CSS** compilado y **autoalojado** en `assets/css/tailwind.css` (sin dependencia de CDN, más rápido).
- **Google Fonts** (Playfair Display, Cormorant Garamond, Jost) + imágenes de muestra en **SVG** ligero.
- **JavaScript** moderno (pestañas de servicios, filtro del lookbook, menú móvil, render del contenido del CMS).
- **Decap CMS** (antes Netlify CMS) + **Netlify Identity / Git Gateway**.
- **Netlify Forms** para el formulario de contacto.

> El CSS compilado ya está incluido en el repositorio, por lo que **el sitio funciona sin
> ningún paso de build** en Netlify. Solo necesitas recompilar si modificas el HTML/JS o el diseño.

## Estructura de archivos

```
.
├── index.html              # Página principal (Hero, Servicios, Lookbook, Equipo, Opiniones, Contacto)
├── gracias.html            # Página de agradecimiento del formulario
├── sitemap.xml             # Mapa del sitio para Google
├── robots.txt              # Reglas de rastreo
├── favicon.svg             # Icono
├── netlify.toml            # Config de despliegue y cabeceras
├── admin/
│   ├── index.html          # Panel de gestión Decap CMS
│   └── config.yml          # Colecciones editables (servicios, equipo, porfolio, opiniones, ajustes)
├── assets/
│   ├── css/styles.css      # Estilos personalizados sobre Tailwind
│   └── js/main.js          # Lógica de la web
├── content/                # Contenido editable por el CMS (JSON)
│   ├── settings.json       # Datos del negocio, Hero, horarios, enlaces
│   ├── services.json       # Servicios y tarifario por categorías
│   ├── team.json           # Miembros del equipo (Jessica, Geri...)
│   ├── portfolio.json      # Trabajos del lookbook
│   └── testimonials.json   # Opiniones de clientes
└── images/                 # Fotos (uploads del CMS, porfolio y equipo)
```

## Ver la web en local

Al usar `fetch` para cargar el contenido, ábrela con un servidor local (no con `file://`):

```bash
# Opción sencilla con Python
python3 -m http.server 8080
# luego abre http://localhost:8080
```

## Modificar el diseño (recompilar Tailwind)

Solo si cambias clases en el HTML/JS o los colores del tema. El CSS ya viene compilado.

```bash
npm install            # instala Tailwind (devDependency)
npm run build:css      # genera assets/css/tailwind.css minificado
# o, mientras editas:
npm run watch:css
```

Los colores y tipografías se definen en `tailwind.config.js`; los estilos propios en
`assets/css/tailwind.src.css`. Las imágenes de muestra (SVG) se generan solas y se
sustituyen por fotos reales colocándolas en `images/portfolio/` e `images/team/`
(o subiéndolas desde el CMS).

### Probar el CMS en local

```bash
npx decap-server      # arranca el backend local en el puerto 8081
# en otra terminal, sirve la web y abre http://localhost:8080/admin/
```

(`local_backend: true` ya está activado en `admin/config.yml`.)

## Publicar: GitHub + Netlify + CMS

1. **GitHub** — sube este repositorio (rama de producción: `main`).
2. **Netlify** — *Add new site → Import from Git* y selecciona el repo.
   Sin comando de build; carpeta de publicación `.` (ya definido en `netlify.toml`).
3. **Netlify Identity** — *Site settings → Identity → Enable Identity*.
   - Registration: *Invite only* (recomendado) e invita el email del cliente.
   - *Identity → Services → Git Gateway → Enable*.
4. **Decap CMS** — el panel queda accesible en `https://TU-SITIO.netlify.app/admin/`.
   El cliente inicia sesión con su email y ya puede editar todo.
5. **Netlify Forms** — se detecta automáticamente el formulario `contacto`
   (los envíos aparecen en *Site → Forms*).
6. **Dominio y URLs** — cuando tengas el dominio final, reemplaza
   `https://chloealcobendas.netlify.app` en `index.html` (meta/canonical/JSON-LD),
   `sitemap.xml`, `robots.txt` y `admin/config.yml`; y en `admin/config.yml`
   ajusta `branch` si tu rama de producción no es `main`.

## SEO local

- `title`, `description` y `keywords` orientados a búsquedas como
  *peluquería en la calle del fuego alcobendas*, *centro de estética en Alcobendas*,
  *alisado orgánico vegano Alcobendas* y *uñas acrílicas Alcobendas*.
- Datos estructurados **JSON-LD** `HairSalon` con dirección, horario, geolocalización,
  valoración y servicios con precios.
- `sitemap.xml` + `robots.txt`.
- Recomendado: dar de alta/enlazar el **Perfil de Empresa de Google** para máximo impacto local.

## Datos del negocio usados

- **Dirección:** Calle del Fuego, 46, 28100 Alcobendas, Madrid.
- **Reservas:** [Booksy](https://booksy.com/es-es/81001_chloe_otro_52925_alcobendas).
- **Instagram:** [@peluqueriayesteticachloe](https://www.instagram.com/peluqueriayesteticachloe/).
- **Valoración:** 4,4 ★ · 52 reseñas (Booksy).
- **Horario:** Lun–Sáb, 10:30–20:00 (editable desde el CMS).

> Nota: el número de teléfono no era público en las fuentes consultadas; se deja
> vacío y **editable desde el CMS** (`Ajustes → Teléfono`). Al rellenarlo aparecerá
> automáticamente en Contacto y en el botón del Hero.

## Sustituir imágenes

Coloca las fotos reales en `images/portfolio/` y `images/team/` con los nombres
referenciados en `content/portfolio.json` y `content/team.json`, o súbelas
directamente desde el CMS (se guardan en `images/uploads/`).
