// Content model for the static SEO landing pages.
// Each page is hand-written and distinct — no boilerplate cloning — so the set
// reads as a genuine resource rather than a doorway-page farm. Emphasis uses
// **markdown bold**, converted to <strong> by the renderer.

export const SITE = {
  name: 'FavGrab',
  baseUrl: 'https://favgrab.boldkit.dev',
  toolUrl: '/convert',
  ogImage: 'https://ik.imagekit.io/fincalfy/favgrab-hero',
  org: 'Vanikya AI',
  orgUrl: 'https://vanikya.ai',
  github: 'https://github.com/ANIBIT14/favgrab',
  lastmod: '2026-06-03',
}

// Shared "why convert locally" cards — worded once, reused on pair pages where it
// would otherwise be repetitive. Hub and a few pages override with their own.
const PRIVACY_CARDS = [
  {
    h: 'Nothing is uploaded',
    p: 'Every byte is decoded and re-encoded on your own machine using Canvas and WebAssembly. Your images never touch a server, so there is no upload bar, no queue, and no copy of your file sitting in someone else’s bucket.',
  },
  {
    h: 'Works offline',
    p: 'After the first load the converter is cached. Open it on a plane, on hotel Wi-Fi, or with the cable unplugged and it still runs at your CPU’s full speed.',
  },
]

// ── Format fact sheet (used to build the comparison columns) ─────────────────
const F = {
  HEIC: {
    name: 'HEIC', rows: [
      ['Compression', 'Lossy (HEVC) — very small files'],
      ['Transparency', 'Rarely used in practice'],
      ['Compatibility', 'Apple devices only — breaks on Windows, Android & most web'],
      ['Best for', 'Saving storage inside the iPhone Photos app'],
    ],
  },
  JPG: {
    name: 'JPG', rows: [
      ['Compression', 'Lossy — adjustable quality'],
      ['Transparency', 'No (flattens onto a background)'],
      ['Compatibility', 'Universal — opens literally everywhere'],
      ['Best for', 'Photographs, email attachments, uploads that must just work'],
    ],
  },
  PNG: {
    name: 'PNG', rows: [
      ['Compression', 'Lossless — no quality loss'],
      ['Transparency', 'Yes (full alpha channel)'],
      ['Compatibility', 'Universal'],
      ['Best for', 'Logos, screenshots, icons, line art, anything with transparency'],
    ],
  },
  WEBP: {
    name: 'WebP', rows: [
      ['Compression', 'Lossy or lossless — adjustable'],
      ['Transparency', 'Yes (alpha channel)'],
      ['Compatibility', 'Every modern browser since 2020'],
      ['Best for', 'Fast-loading website images at small file sizes'],
    ],
  },
  ICO: {
    name: 'ICO', rows: [
      ['Format', 'Icon container — can hold several sizes'],
      ['Transparency', 'Yes'],
      ['Compatibility', 'Browsers (favicon.ico) and Windows icons'],
      ['Best for', 'favicon.ico and desktop application icons'],
    ],
  },
}

// ── Pair pages ───────────────────────────────────────────────────────────────
const PAIRS = [
  {
    from: 'HEIC', to: 'JPG',
    title: 'Convert HEIC to JPG — Free, in Your Browser · FavGrab',
    description: 'Turn iPhone HEIC photos into universal JPG files. 100% in your browser, no uploads, batch supported, completely free. No app to install.',
    keywords: 'heic to jpg, heic to jpeg, convert heic to jpg, iphone heic converter, heic to jpg online, heic converter free',
    eyebrow: 'HEIC → JPG',
    h1: 'Convert <span class="hl">HEIC</span> to JPG',
    lead: 'Your iPhone saves photos as HEIC. Almost everything else — Windows, older Androids, web uploads, your boss’s email client — wants JPG. Drop the files here and get clean JPGs back without anything leaving your device.',
    intro: [
      'Apple switched the default camera format to **HEIC** in 2017 because it stores the same photo at roughly half the size of a JPEG. The catch is compatibility: open a `.heic` file on a Windows PC, attach one to a web form, or send it to a friend on Android and it often shows up as a broken thumbnail or refuses to open at all.',
      'Converting to **JPG** fixes that instantly. JPG is the most universally supported image format in existence — there is no device, browser, or upload form made in the last 30 years that can’t read it. This page does the conversion entirely inside your browser tab, so even a folder full of personal photos never gets uploaded anywhere.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Click the button above to open the FavGrab converter — no sign-up, no install.' },
      { b: 'Drop your HEIC photos', text: 'Drag one file or a whole batch of iPhone photos onto the dropzone. The HEIC decoder loads automatically the first time it’s needed.' },
      { b: 'Pick JPG and set quality', text: 'Choose JPG as the output and nudge the quality slider — 90–95 keeps photos crisp while staying small.' },
      { b: 'Convert and download', text: 'Hit Convert, then download each JPG, or grab the whole set as a single ZIP.' },
    ],
    compareLeft: F.HEIC, compareRight: F.JPG,
    useCases: [
      'Uploading iPhone photos to a website or job application that rejects HEIC',
      'Sharing pictures with someone on Windows or Android',
      'Editing in older software that can’t open HEIC',
      'Printing — many print services only accept JPG',
    ],
    faq: [
      { q: 'Will I lose photo quality converting HEIC to JPG?', a: ['HEIC is already a compressed format, so a small amount of detail was discarded by the camera. Converting to JPG at quality 90 or above keeps the result visually identical for almost any purpose. Use 100 if you want the most faithful copy at a larger file size.'] },
      { q: 'Are my photos uploaded to convert them?', a: ['No. The decoding and encoding happen with WebAssembly inside your browser. Your photos never leave your computer or phone — there is no server involved in the conversion.'] },
      { q: 'Can I convert many HEIC files at once?', a: ['Yes. Drop a whole album, convert them in one go, and download everything as a single ZIP archive.'] },
      { q: 'Does this work on iPhone and iPad?', a: ['Yes — it runs in Safari or Chrome on iOS, so you can convert straight from your phone without an app.'] },
    ],
    related: ['/convert/heic-to-png', '/convert/png-to-jpg', '/convert/jpg-to-png', '/image-converter'],
    ctaTitle: 'Got a folder of HEIC photos?',
    ctaText: 'Convert the whole batch to JPG in one pass — privately, in your browser.',
  },

  {
    from: 'HEIC', to: 'PNG',
    title: 'Convert HEIC to PNG — Lossless, Private, Free · FavGrab',
    description: 'Convert iPhone HEIC images to lossless PNG with transparency support. Runs locally in your browser — no uploads, no signup, batch & ZIP download.',
    keywords: 'heic to png, convert heic to png, heic to png online, iphone heic to png, heic png converter, lossless heic converter',
    eyebrow: 'HEIC → PNG',
    h1: 'Convert <span class="hl">HEIC</span> to PNG',
    lead: 'When you need an iPhone photo as a clean, lossless PNG — for editing, design work, or a tool that demands PNG — convert it here without uploading anything.',
    intro: [
      'PNG is the format designers and editing tools reach for when they want **no further quality loss**. Unlike JPG, every conversion to PNG is lossless: once your HEIC is decoded, the PNG holds exactly those pixels with nothing thrown away.',
      'That makes HEIC → PNG the right choice when the image is headed into Photoshop, Figma, a slide deck, or any pipeline that will re-edit and re-save it. The trade-off is file size — PNG files are considerably larger than HEIC or JPG, which is the price of being lossless. If your goal is a small, shareable photo instead, **JPG** is usually the better target.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Launch FavGrab’s in-browser converter from the button above.' },
      { b: 'Add your HEIC files', text: 'Drag the iPhone photos in. The HEIC decoder loads on demand the first time.' },
      { b: 'Choose PNG', text: 'Select PNG as the output. There’s no quality setting — PNG is always lossless.' },
      { b: 'Convert & save', text: 'Click Convert and download your PNGs individually or as a ZIP.' },
    ],
    compareLeft: F.HEIC, compareRight: F.PNG,
    useCases: [
      'Bringing an iPhone photo into Photoshop, GIMP, or Figma for editing',
      'Any tool or form that specifically requires PNG',
      'Keeping a lossless master copy before further edits',
      'Images that need a transparent background after editing',
    ],
    faq: [
      { q: 'Is HEIC to PNG lossless?', a: ['The PNG step itself is fully lossless — it preserves every pixel decoded from the HEIC. Note the original HEIC was already lossy out of the camera, so PNG cannot recover detail the camera discarded; it simply stops any *further* loss from happening.'] },
      { q: 'Why is my PNG so much bigger than the HEIC?', a: ['PNG stores image data without lossy compression, so files are naturally several times larger than HEIC or JPG. That’s expected and is the cost of a lossless, edit-friendly format. For sharing or web use, convert to JPG or WebP instead.'] },
      { q: 'Does the conversion happen online?', a: ['No server is involved. Everything runs locally in your browser with WebAssembly, so your photos stay on your device.'] },
      { q: 'Can I convert a batch of HEIC photos to PNG?', a: ['Yes — add as many as you like, convert them together, and download a single ZIP of all the PNGs.'] },
    ],
    related: ['/convert/heic-to-jpg', '/convert/png-to-jpg', '/convert/png-to-webp', '/image-converter'],
    ctaTitle: 'Need a lossless PNG from your iPhone shot?',
    ctaText: 'Convert HEIC to PNG locally — your photos never leave the browser.',
  },

  {
    from: 'WebP', to: 'PNG',
    title: 'Convert WebP to PNG — Free Browser Converter · FavGrab',
    description: 'Save WebP images you found online as standard PNG files. Local, private, no uploads. Batch convert and download as ZIP — completely free.',
    keywords: 'webp to png, convert webp to png, webp to png online, save webp as png, webp png converter free, webp image to png',
    eyebrow: 'WebP → PNG',
    h1: 'Convert <span class="hl">WebP</span> to PNG',
    lead: 'Downloaded an image and your computer saved it as a `.webp` you can’t open? Convert it to a friendly PNG here — instantly and without uploading it anywhere.',
    intro: [
      'WebP is everywhere on the modern web because it loads fast, but it’s a constant source of friction off the web. Save an image from a site and you’ll often get a **.webp** file that Windows Photo Viewer, older design tools, and plenty of apps simply refuse to open.',
      'Converting to **PNG** solves that for good. PNG is lossless and universally supported, so the converted file opens in any image viewer, editor, or document. Because WebP and PNG both support transparency, a transparent WebP keeps its transparent background through the conversion — nothing is flattened or filled in.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above.' },
      { b: 'Drop the WebP file', text: 'Drag the .webp image onto the dropzone — or add several at once.' },
      { b: 'Select PNG', text: 'Pick PNG as the output format. Transparency is preserved automatically.' },
      { b: 'Download', text: 'Convert and save your PNG, or download a ZIP if you converted a batch.' },
    ],
    compareLeft: F.WEBP, compareRight: F.PNG,
    useCases: [
      'Opening a downloaded .webp in software that doesn’t support WebP',
      'Editing a WebP image in an older version of Photoshop',
      'Inserting an image into a document or app that rejects WebP',
      'Keeping a transparent image transparent in a universal format',
    ],
    faq: [
      { q: 'Does converting WebP to PNG keep transparency?', a: ['Yes. Both formats support an alpha channel, so a WebP with a transparent background converts to a PNG with the same transparent background — no white box is added.'] },
      { q: 'Is there any quality loss?', a: ['The PNG step is lossless. If the original WebP was saved with lossy compression, those characteristics are already baked in, but converting to PNG won’t add any new loss.'] },
      { q: 'Why won’t Windows open my WebP normally?', a: ['Older Windows builds and many desktop apps never added WebP support. Converting to PNG sidesteps the problem entirely since PNG opens everywhere.'] },
      { q: 'Can I convert WebP to PNG in bulk?', a: ['Yes — drop a whole folder of WebP files, convert them together, and download them all as one ZIP.'] },
    ],
    related: ['/convert/png-to-webp', '/convert/webp-to-jpg', '/convert/png-to-jpg', '/image-converter'],
    ctaTitle: 'Stuck with a .webp you can’t open?',
    ctaText: 'Turn it into a universal PNG in seconds — privately, in your browser.',
  },

  {
    from: 'PNG', to: 'WebP',
    title: 'Convert PNG to WebP — Shrink Images Free · FavGrab',
    description: 'Compress PNG images to lightweight WebP for faster websites. Adjustable quality, transparency kept, 100% local in your browser. Free, no uploads.',
    keywords: 'png to webp, convert png to webp, png to webp converter, compress png to webp, png webp online, reduce image size webp',
    eyebrow: 'PNG → WebP',
    h1: 'Convert <span class="hl">PNG</span> to WebP',
    lead: 'PNGs are big. WebP keeps the same image — transparency and all — at a fraction of the size. Convert here to make your site faster, with a quality slider you control.',
    intro: [
      'If your web pages are heavy and slow, oversized **PNG** files are often the reason. PNG is lossless, which is great for quality but terrible for download size — a single hero image can weigh several megabytes.',
      'Re-encoding to **WebP** typically cuts that by 25–35% (and far more for photographic content) while keeping the alpha transparency PNG is loved for. Every major browser has supported WebP since 2020, so it’s safe to ship today. Use the quality slider to find the sweet spot between crispness and file size — and since it all runs locally, you can experiment freely without re-uploading anything.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open the FavGrab converter from the button above.' },
      { b: 'Drop your PNGs', text: 'Add one image or a batch of PNGs to optimise.' },
      { b: 'Choose WebP and tune quality', text: 'Select WebP, then set the quality slider — around 80 is an excellent balance for web images.' },
      { b: 'Convert & compare', text: 'Convert and check the new size shown next to each file before downloading.' },
    ],
    compareLeft: F.PNG, compareRight: F.WEBP,
    useCases: [
      'Speeding up a website by shrinking image payloads',
      'Improving Core Web Vitals / Lighthouse scores',
      'Serving smaller images without losing transparency',
      'Reducing storage and bandwidth costs for image-heavy sites',
    ],
    faq: [
      { q: 'How much smaller will my WebP be?', a: ['It depends on the image, but expect roughly 25–35% smaller than a PNG for graphics, and often much more for photographic content. The converter shows the resulting size for each file so you can verify before downloading.'] },
      { q: 'Does WebP keep PNG transparency?', a: ['Yes. WebP supports a full alpha channel, so transparent PNGs convert to transparent WebP with no background added.'] },
      { q: 'Is WebP safe to use on my website?', a: ['Yes — every current browser (Chrome, Edge, Firefox, Safari) has supported WebP for years. It’s a standard choice for production web images.'] },
      { q: 'Lossy or lossless WebP?', a: ['The quality slider controls lossy WebP, which gives the biggest size savings. Set quality to 100 for a near-lossless result if you’d rather keep maximum fidelity.'] },
    ],
    related: ['/convert/webp-to-png', '/convert/jpg-to-webp', '/convert/png-to-jpg', '/image-converter'],
    ctaTitle: 'Make your images lighter',
    ctaText: 'Convert PNG to WebP and watch the file size drop — all in your browser.',
  },

  {
    from: 'PNG', to: 'ICO',
    title: 'Convert PNG to ICO — Free Favicon Maker · FavGrab',
    description: 'Turn a PNG into an ICO favicon or Windows icon. Local, free, no uploads. Generate favicon.ico in your browser in one click.',
    keywords: 'png to ico, convert png to ico, png to favicon, favicon.ico generator, png to ico online, create ico from png',
    eyebrow: 'PNG → ICO',
    h1: 'Convert <span class="hl">PNG</span> to ICO',
    lead: 'Need a `favicon.ico` or a Windows app icon from your PNG logo? Generate the ICO right here — no upload, no watermark, no email wall.',
    intro: [
      'The classic **favicon.ico** at the root of a website, and the icons Windows uses for shortcuts and executables, both rely on the **ICO** format. ICO is a container: it can bundle several resolutions in one file so the operating system or browser can pick the size it needs.',
      'Designers almost always work in **PNG**, so getting from a PNG logo to an ICO is one of the most common little chores in web and desktop development. This converter does it locally — drop your PNG, get an ICO back, and drop it straight into your project. For best results, start from a square PNG (for example 256×256) so the icon stays sharp at every size.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above.' },
      { b: 'Drop a square PNG', text: 'Add your logo — a square PNG such as 256×256 gives the crispest icon.' },
      { b: 'Select ICO', text: 'Choose ICO as the output format.' },
      { b: 'Convert & ship', text: 'Convert, download the .ico, and place it at your site root as favicon.ico.' },
    ],
    compareLeft: F.PNG, compareRight: F.ICO,
    useCases: [
      'Generating a favicon.ico for a website',
      'Creating a Windows application or shortcut icon',
      'Producing an icon from an exported logo',
      'Replacing a placeholder favicon with your own brand mark',
    ],
    faq: [
      { q: 'What size PNG should I use for a favicon?', a: ['A square PNG of 256×256 (or at least 64×64) works well. Starting square avoids stretching, and a larger source keeps the icon sharp when the browser scales it down to 16×16 or 32×32.'] },
      { q: 'Where do I put the favicon.ico?', a: ['Place the converted file at the root of your website as `favicon.ico`. Most browsers request it automatically; you can also reference it with a `<link rel="icon">` tag.'] },
      { q: 'Does ICO support transparency?', a: ['Yes. Keep your PNG’s transparent background and the resulting ICO will be transparent too, so the icon blends into any tab colour.'] },
      { q: 'Is anything uploaded to make the ICO?', a: ['No. The ICO is built in your browser from your PNG — nothing is sent to a server.'] },
    ],
    related: ['/convert/png-to-jpg', '/convert/png-to-webp', '/convert/jpg-to-png', '/image-converter'],
    ctaTitle: 'Build your favicon now',
    ctaText: 'Convert a PNG logo into a ready-to-ship ICO — locally and free.',
  },

  {
    from: 'JPG', to: 'PNG',
    title: 'Convert JPG to PNG — Free & Lossless · FavGrab',
    description: 'Convert JPG / JPEG images to lossless PNG in your browser. No uploads, no signup, batch and ZIP supported. Free forever.',
    keywords: 'jpg to png, jpeg to png, convert jpg to png, jpg to png online, jpeg png converter, jpg to png free',
    eyebrow: 'JPG → PNG',
    h1: 'Convert <span class="hl">JPG</span> to PNG',
    lead: 'When a tool insists on PNG, or you want a lossless copy to edit, convert your JPG here — locally, with nothing uploaded.',
    intro: [
      '**JPG** is the workhorse of photography: small files, universal support. But it has two limits — it’s lossy, and it can’t store transparency. When you need to hand an image to a design tool, place it in a context that requires PNG, or stop further quality loss across repeated edits, converting to **PNG** is the move.',
      'PNG is lossless, so from the moment you convert, no more detail is shed no matter how many times you re-save. Keep in mind PNG can’t magically *restore* sharpness the JPG already lost, and the file will be larger — but for editing and PNG-only workflows that’s exactly the trade you want.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above.' },
      { b: 'Add your JPG files', text: 'Drag one or many JPG / JPEG images onto the dropzone.' },
      { b: 'Choose PNG', text: 'Select PNG — it’s lossless, so there’s no quality setting to worry about.' },
      { b: 'Convert & download', text: 'Convert, then save each PNG or grab the batch as a ZIP.' },
    ],
    compareLeft: F.JPG, compareRight: F.PNG,
    useCases: [
      'Feeding an image into a tool or form that only accepts PNG',
      'Keeping a lossless master before a round of edits',
      'Placing a photo into a design with a flat, predictable format',
      'Preparing source art for further editing in Photoshop or Figma',
    ],
    faq: [
      { q: 'Will JPG to PNG improve image quality?', a: ['No — converting can’t recover detail the JPG already discarded. What it does is make every subsequent save lossless, which prevents quality from degrading further as you edit and re-export.'] },
      { q: 'Can I add transparency by converting to PNG?', a: ['Converting alone won’t remove a background — the photo arrives as a solid image. But once it’s a PNG you can erase the background in an editor and save the transparency, which JPG could never store.'] },
      { q: 'Are my files uploaded?', a: ['No. The conversion runs entirely in your browser; your images stay on your device.'] },
      { q: 'Can I convert several JPGs at once?', a: ['Yes — add a batch, convert them together, and download all the PNGs in a single ZIP.'] },
    ],
    related: ['/convert/png-to-jpg', '/convert/heic-to-png', '/convert/webp-to-png', '/image-converter'],
    ctaTitle: 'Need a lossless PNG?',
    ctaText: 'Convert JPG to PNG in your browser — private, free, no signup.',
  },

  {
    from: 'PNG', to: 'JPG',
    title: 'Convert PNG to JPG — Shrink Files Free · FavGrab',
    description: 'Convert PNG images to compact JPG with an adjustable quality slider. Local, private, no uploads. Batch convert and download as ZIP free.',
    keywords: 'png to jpg, png to jpeg, convert png to jpg, png to jpg online, compress png to jpg, png jpg converter free',
    eyebrow: 'PNG → JPG',
    h1: 'Convert <span class="hl">PNG</span> to JPG',
    lead: 'PNG files can be huge. JPG makes them small and email-friendly. Convert here with a quality slider you control — and nothing leaves your browser.',
    intro: [
      'A **PNG** screenshot or export can easily be several megabytes — too big to email, slow to upload, and overkill when the image has no transparency to protect. **JPG** compresses the same picture down to a small, universally accepted file.',
      'The one thing to know: JPG has no transparency, so any transparent areas in your PNG are flattened onto a solid background during conversion. For photos and opaque graphics that’s a non-issue and the size savings are dramatic. Use the quality slider to balance crispness against file size — it all happens locally, so you can re-try until it’s right.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open the FavGrab converter from the button above.' },
      { b: 'Drop your PNGs', text: 'Add one image or a whole batch.' },
      { b: 'Choose JPG and set quality', text: 'Pick JPG and adjust the quality slider — 85–92 is a great default for most images.' },
      { b: 'Convert & download', text: 'Convert, check the new size, and save your JPGs or a ZIP of the set.' },
    ],
    compareLeft: F.PNG, compareRight: F.JPG,
    useCases: [
      'Emailing or uploading an image that’s too large as a PNG',
      'Compressing screenshots for a bug report or document',
      'Preparing photos for a platform that prefers JPG',
      'Cutting storage on a folder full of heavy PNG exports',
    ],
    faq: [
      { q: 'What happens to transparency when converting PNG to JPG?', a: ['JPG can’t store transparency, so transparent regions are filled with a solid background during conversion. If you need to keep transparency, convert to WebP or stay with PNG instead.'] },
      { q: 'What quality setting should I use?', a: ['For most images, 85–92 looks indistinguishable from the original while making the file much smaller. Drop lower for aggressive compression, or push to 100 to maximise fidelity.'] },
      { q: 'How much smaller will the JPG be?', a: ['Often dramatically — opaque PNGs frequently shrink by 70% or more as JPGs. The converter shows the exact resulting size for each file.'] },
      { q: 'Is the conversion private?', a: ['Completely. It runs in your browser with no uploads, so your images never reach a server.'] },
    ],
    related: ['/convert/jpg-to-png', '/convert/png-to-webp', '/convert/png-to-ico', '/image-converter'],
    ctaTitle: 'Shrink those PNGs',
    ctaText: 'Convert PNG to JPG with full quality control — privately in your browser.',
  },
]

// A couple of extra pairs referenced as related links but not in the focused
// set get gracefully handled by the renderer (it links by URL regardless).
// Build the canonical pair list with derived URLs/files.
function slugOf(from, to) {
  return `${from}-to-${to}`.toLowerCase()
}

export const pages = PAIRS.map(p => {
  const slug = slugOf(p.from, p.to)
  return {
    kind: 'pair',
    ...p,
    url: `/convert/${slug}`,
    file: `convert/${slug}.html`,
    whyCards: p.whyCards ?? PRIVACY_CARDS,
  }
})

// ── Hub / pillar page ────────────────────────────────────────────────────────
export const hub = {
  kind: 'hub',
  url: '/image-converter',
  file: 'image-converter.html',
  title: 'Free Image Converter — PNG, JPG, WebP, AVIF, HEIC · FavGrab',
  description: 'Free online image converter that runs entirely in your browser. Convert PNG, JPG, WebP, AVIF, HEIC, TIFF, BMP and ICO with no uploads, no signup, offline-capable.',
  keywords: 'image converter, free image converter, online image converter, convert image format, png jpg webp avif heic converter, image converter no upload, offline image converter, batch image converter',
  eyebrow: 'Image Converter',
  h1: 'The <span class="hl">image converter</span> that never uploads your files',
  lead: 'Convert between PNG, JPG, WebP, AVIF, HEIC, TIFF, BMP and ICO — entirely inside your browser. No account, no upload, no watermark. Works offline once loaded.',
  intro: [
    'Most “online” image converters quietly upload your pictures to a server, process them there, and hand back a download. That means waiting on your connection, trusting a stranger with your files, and hitting size or batch limits when the free tier runs out.',
    'FavGrab takes the opposite approach: **every conversion happens on your own machine**. It uses the browser’s built-in Canvas APIs plus lazy-loaded WebAssembly codecs (libheif for HEIC, utif2 for TIFF, jSquash for AVIF) so your files never leave the tab. The result is faster, completely private, and free with no limits — convert one image or a hundred, online or offline.',
  ],
  formatsIn: ['PNG', 'JPG', 'WebP', 'AVIF', 'GIF', 'BMP', 'ICO', 'HEIC', 'HEIF', 'TIFF'],
  formatsOut: ['PNG', 'JPG', 'WebP', 'AVIF', 'BMP', 'ICO'],
  features: [
    ['Truly local', 'Nothing is uploaded — decoding and encoding run in your browser.'],
    ['Batch + ZIP', 'Convert many files at once and download them as a single ZIP.'],
    ['Quality control', 'A slider for lossy formats (JPG, WebP, AVIF) to balance size and clarity.'],
    ['Optional resize', 'Cap the longest side in pixels, aspect ratio preserved, downscale-only.'],
    ['Works offline', 'After the first visit the converter runs with no network at all.'],
    ['Free & open source', 'No signup, no watermark, no paywall — and the code is on GitHub.'],
  ],
  popular: [
    '/convert/heic-to-jpg',
    '/convert/heic-to-png',
    '/convert/webp-to-png',
    '/convert/png-to-webp',
    '/convert/png-to-jpg',
    '/convert/jpg-to-png',
    '/convert/png-to-ico',
  ],
  faq: [
    { q: 'Is this image converter really free?', a: ['Yes — completely free with no signup, no watermark, and no paid tier. Because conversions run in your browser there are no server costs to recoup, so there’s nothing to upsell.'] },
    { q: 'Are my images uploaded anywhere?', a: ['No. Every image is decoded and re-encoded locally using your browser’s Canvas and WebAssembly. Your files never touch a server, which makes the tool both private and fast.'] },
    { q: 'Which formats can I convert between?', a: ['You can open PNG, JPG, WebP, AVIF, GIF, BMP, ICO, HEIC, HEIF and TIFF, and export to PNG, JPG, WebP, AVIF, BMP or ICO. HEIC and TIFF decoders load automatically the first time you need them.'] },
    { q: 'Can I convert multiple images at once?', a: ['Yes. Drop a whole batch, convert them in one pass, and download everything as a single ZIP archive.'] },
    { q: 'Does it work offline?', a: ['Yes. After your first visit the converter is cached, so it keeps working with no internet connection at all.'] },
    { q: 'Will converting reduce my image quality?', a: ['Lossless targets like PNG keep every pixel. For lossy targets (JPG, WebP, AVIF) you control fidelity with the quality slider, and the tool shows the resulting file size so you can pick the right balance.'] },
  ],
  ctaTitle: 'Convert an image right now',
  ctaText: 'Open the converter, drop your files, and download — nothing ever leaves your browser.',
}

export const allPages = [hub, ...pages]
