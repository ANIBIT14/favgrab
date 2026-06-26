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
  lastmod: '2026-06-26',
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
  JFIF: {
    name: 'JFIF', rows: [
      ['What it is', 'A JPEG file — JFIF is the standard JPEG container'],
      ['Compression', 'Lossy — identical to JPG, with adjustable quality'],
      ['Transparency', 'No (flattens onto a background, exactly like JPG)'],
      ['Compatibility', 'Same bytes as JPG, but the .jfif name confuses many apps'],
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
  AVIF: {
    name: 'AVIF', rows: [
      ['Compression', 'Lossy or lossless — smaller than WebP at equal quality'],
      ['Transparency', 'Yes (full alpha channel)'],
      ['Compatibility', 'All current browsers — patchy in older apps & editors'],
      ['Best for', 'The smallest high-quality images on a modern website'],
    ],
  },
  GIF: {
    name: 'GIF', rows: [
      ['Compression', 'Lossless, limited to a 256-colour palette'],
      ['Transparency', 'On/off only (1-bit, no soft edges)'],
      ['Compatibility', 'Universal'],
      ['Best for', 'Simple animations and low-colour graphics'],
    ],
  },
  TIFF: {
    name: 'TIFF', rows: [
      ['Compression', 'Lossless or uncompressed — very large files'],
      ['Transparency', 'Yes (alpha channel)'],
      ['Compatibility', 'Pro scan/print software — poor on web & phones'],
      ['Best for', 'Scans, print masters and archival originals'],
    ],
  },
  BMP: {
    name: 'BMP', rows: [
      ['Compression', 'Uncompressed — needlessly large files'],
      ['Transparency', 'Not in practice'],
      ['Compatibility', 'Opens on Windows and most editors, but bulky'],
      ['Best for', 'Raw bitmaps and legacy Windows tools'],
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

  {
    from: 'WebP', to: 'JPG',
    title: 'Convert WebP to JPG — Free, No Upload · FavGrab',
    description: 'Turn WebP images into universal JPG files in your browser. No uploads, batch convert, adjustable quality, completely free. No app to install.',
    keywords: 'webp to jpg, webp to jpeg, convert webp to jpg, webp to jpg online, save webp as jpg, webp jpg converter free',
    eyebrow: 'WebP → JPG',
    h1: 'Convert <span class="hl">WebP</span> to JPG',
    lead: 'Saved a `.webp` from the web and need a normal JPG you can email, upload, or open anywhere? Convert it here — instantly, with nothing leaving your browser.',
    intro: [
      'Websites serve **WebP** because it’s small and fast, but the moment you save one of those images you inherit a file that plenty of apps, email clients, and upload forms still reject. A `.webp` that looked fine in the browser suddenly won’t attach, won’t print, and won’t open in older software.',
      'Converting to **JPG** removes every one of those snags. JPG is the most widely supported image format there is, so the result drops cleanly into any document, inbox, or website. If the WebP had transparency it’s flattened onto a solid background — JPG can’t store an alpha channel — which is exactly what you want for photos and opaque graphics headed somewhere that demands JPG.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Click the button above to open the FavGrab converter — no sign-up, no install.' },
      { b: 'Drop the WebP files', text: 'Add one .webp image or a whole batch onto the dropzone.' },
      { b: 'Choose JPG and set quality', text: 'Pick JPG and nudge the quality slider — 85–92 keeps it crisp while staying small.' },
      { b: 'Convert & download', text: 'Convert, check the new size, and save each JPG or grab the set as a single ZIP.' },
    ],
    compareLeft: F.WEBP, compareRight: F.JPG,
    useCases: [
      'Attaching an image to an email client that won’t accept WebP',
      'Uploading to a form or marketplace that only takes JPG',
      'Opening a downloaded image in older photo software',
      'Printing — most print services expect JPG',
    ],
    faq: [
      { q: 'Is there quality loss converting WebP to JPG?', a: ['Both are lossy formats, so re-encoding adds a small generational loss. Keeping the quality slider at 90 or above makes the result visually indistinguishable for almost any use.'] },
      { q: 'What happens to a transparent WebP?', a: ['JPG has no transparency, so any transparent areas are filled with a solid background during conversion. If you need to keep transparency, convert to PNG instead.'] },
      { q: 'Are my files uploaded to convert them?', a: ['No. The decoding and encoding run with WebAssembly and Canvas inside your browser. Your images never leave your device.'] },
      { q: 'Can I convert many WebP files at once?', a: ['Yes — drop a whole folder, convert them together, and download everything as a single ZIP.'] },
    ],
    related: ['/convert/webp-to-png', '/convert/jpg-to-webp', '/convert/png-to-jpg', '/image-converter'],
    ctaTitle: 'Need a JPG you can actually use?',
    ctaText: 'Convert WebP to JPG in seconds — privately, in your browser.',
  },

  {
    from: 'JPG', to: 'WebP',
    title: 'Convert JPG to WebP — Shrink Photos Free · FavGrab',
    description: 'Compress JPG / JPEG photos to smaller WebP for faster websites. Adjustable quality, 100% local in your browser, batch and ZIP. Free, no uploads.',
    keywords: 'jpg to webp, jpeg to webp, convert jpg to webp, compress jpg to webp, jpg webp converter, reduce jpg size webp',
    eyebrow: 'JPG → WebP',
    h1: 'Convert <span class="hl">JPG</span> to WebP',
    lead: 'WebP fits the same photo into a noticeably smaller file than JPG. Convert here to speed up your site, with a quality slider you control — and nothing uploaded.',
    intro: [
      '**JPG** has powered web photos for decades, but it’s no longer the most efficient option. For the same visual quality, **WebP** usually lands 25–35% smaller, which means faster page loads and lower bandwidth bills.',
      'Because every current browser has supported WebP since 2020, it’s safe to ship in production today. This converter re-encodes your JPGs locally — drag in a folder of photos, set the quality, and compare the new sizes before you download. Nothing is uploaded, so you can experiment with the quality slider as much as you like.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open the FavGrab converter from the button above — no account needed.' },
      { b: 'Drop your JPGs', text: 'Add one image or a batch of JPG / JPEG photos to optimise.' },
      { b: 'Choose WebP and tune quality', text: 'Select WebP, then set the slider — around 80 is an excellent balance for web images.' },
      { b: 'Convert & compare', text: 'Convert and check the new size shown next to each file before downloading.' },
    ],
    compareLeft: F.JPG, compareRight: F.WEBP,
    useCases: [
      'Speeding up a website by shrinking photo payloads',
      'Improving Core Web Vitals / Lighthouse scores',
      'Serving smaller image galleries without visible quality loss',
      'Reducing storage and bandwidth costs for image-heavy sites',
    ],
    faq: [
      { q: 'How much smaller will the WebP be?', a: ['For most photos, expect roughly 25–35% smaller than the JPG at the same perceived quality. The converter shows the resulting size for each file so you can verify before downloading.'] },
      { q: 'Is WebP safe to use on my website?', a: ['Yes — every current browser (Chrome, Edge, Firefox, Safari) has supported WebP for years. It’s a standard choice for production web images.'] },
      { q: 'Will I lose quality converting JPG to WebP?', a: ['A JPG is already lossy, and WebP re-encodes it, so there is a small generational loss. At quality 80 or above it’s visually negligible while the file gets meaningfully smaller.'] },
      { q: 'Can I convert a batch of JPGs at once?', a: ['Yes — drop many files, convert them together, and download them all as one ZIP.'] },
    ],
    related: ['/convert/webp-to-jpg', '/convert/png-to-webp', '/convert/jpg-to-avif', '/image-converter'],
    ctaTitle: 'Make your photos lighter',
    ctaText: 'Convert JPG to WebP and watch the file size drop — all in your browser.',
  },

  {
    from: 'AVIF', to: 'PNG',
    title: 'Convert AVIF to PNG — Free Browser Converter · FavGrab',
    description: 'Save AVIF images as universal PNG files. Local, private, no uploads. Transparency preserved, batch convert and download as ZIP — completely free.',
    keywords: 'avif to png, convert avif to png, avif to png online, open avif file, save avif as png, avif png converter',
    eyebrow: 'AVIF → PNG',
    h1: 'Convert <span class="hl">AVIF</span> to PNG',
    lead: 'Downloaded an `.avif` your software refuses to open? Convert it to a universal PNG right here — losslessly and without uploading anything.',
    intro: [
      '**AVIF** is the newest high-efficiency image format — it compresses even better than WebP — so more sites are starting to serve it. The downside shows up the moment you save one: many editors, viewers, and apps still don’t recognise `.avif` at all.',
      'Converting to **PNG** makes the image open everywhere. PNG is lossless and universally supported, and because both formats carry an alpha channel, a transparent AVIF keeps its transparent background through the conversion. The PNG will be larger than the AVIF — that’s simply the cost of universal, lossless compatibility.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above — no sign-up, no install.' },
      { b: 'Drop the AVIF file', text: 'Drag the .avif image onto the dropzone, or add several at once.' },
      { b: 'Select PNG', text: 'Pick PNG as the output. Transparency is preserved automatically.' },
      { b: 'Download', text: 'Convert and save your PNG, or download a ZIP if you converted a batch.' },
    ],
    compareLeft: F.AVIF, compareRight: F.PNG,
    useCases: [
      'Opening a downloaded .avif in software that doesn’t support it',
      'Editing an AVIF image in an older version of Photoshop',
      'Inserting an image into a document or app that rejects AVIF',
      'Keeping a transparent image transparent in a universal format',
    ],
    faq: [
      { q: 'Does converting AVIF to PNG keep transparency?', a: ['Yes. Both formats support an alpha channel, so a transparent AVIF converts to a PNG with the same transparent background — no white box is added.'] },
      { q: 'Is there any quality loss?', a: ['The PNG step is lossless. If the original AVIF used lossy compression, those characteristics are already baked in, but converting to PNG won’t add any new loss.'] },
      { q: 'Why won’t my AVIF open normally?', a: ['Plenty of desktop apps and older OS builds never added AVIF support. Converting to PNG sidesteps the problem entirely since PNG opens everywhere.'] },
      { q: 'Can I convert AVIF to PNG in bulk?', a: ['Yes — drop a whole folder of AVIF files, convert them together, and download them all as one ZIP.'] },
    ],
    related: ['/convert/avif-to-jpg', '/convert/png-to-avif', '/convert/webp-to-png', '/image-converter'],
    ctaTitle: 'Stuck with an .avif you can’t open?',
    ctaText: 'Turn it into a universal PNG in seconds — privately, in your browser.',
  },

  {
    from: 'AVIF', to: 'JPG',
    title: 'Convert AVIF to JPG — Free, No Upload · FavGrab',
    description: 'Turn AVIF images into universal JPG files in your browser. No uploads, batch convert, adjustable quality. Completely free, no signup.',
    keywords: 'avif to jpg, avif to jpeg, convert avif to jpg, avif to jpg online, save avif as jpg, avif jpg converter',
    eyebrow: 'AVIF → JPG',
    h1: 'Convert <span class="hl">AVIF</span> to JPG',
    lead: 'Need a plain JPG from an `.avif` file? Convert it here — instantly, with adjustable quality and nothing leaving your browser.',
    intro: [
      'AVIF gives websites the smallest high-quality images available today, but that efficiency is useless once a file lands somewhere that can’t read it. Save an `.avif` and you may find it won’t attach to an email, upload to a form, or open in everyday photo software.',
      '**JPG** is the universal answer. Converting AVIF → JPG produces a file that works literally everywhere, at a size that stays email- and upload-friendly. Any transparency in the AVIF is flattened onto a solid background, since JPG doesn’t support an alpha channel — ideal for photos and opaque images.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above — no account, no install.' },
      { b: 'Drop the AVIF files', text: 'Add one .avif image or a whole batch onto the dropzone.' },
      { b: 'Choose JPG and set quality', text: 'Pick JPG and nudge the quality slider — 85–92 keeps it crisp while staying small.' },
      { b: 'Convert & download', text: 'Convert, then save each JPG or grab the whole set as a single ZIP.' },
    ],
    compareLeft: F.AVIF, compareRight: F.JPG,
    useCases: [
      'Attaching an image to an email client that won’t accept AVIF',
      'Uploading to a website or marketplace that only takes JPG',
      'Opening a downloaded image in older photo software',
      'Printing — most print services expect JPG',
    ],
    faq: [
      { q: 'Is there quality loss converting AVIF to JPG?', a: ['Both are lossy formats, so re-encoding adds a small generational loss. Keeping quality at 90 or above makes the result visually indistinguishable for almost any purpose.'] },
      { q: 'What happens to a transparent AVIF?', a: ['JPG can’t store transparency, so transparent areas are filled with a solid background. If you need to keep transparency, convert to PNG instead.'] },
      { q: 'Are my files uploaded?', a: ['No. The conversion runs entirely in your browser with WebAssembly; your images never reach a server.'] },
      { q: 'Can I convert several AVIF files at once?', a: ['Yes — add a batch, convert them together, and download all the JPGs in a single ZIP.'] },
    ],
    related: ['/convert/avif-to-png', '/convert/jpg-to-avif', '/convert/webp-to-jpg', '/image-converter'],
    ctaTitle: 'Need a JPG from that AVIF?',
    ctaText: 'Convert AVIF to JPG in seconds — privately, in your browser.',
  },

  {
    from: 'PNG', to: 'AVIF',
    title: 'Convert PNG to AVIF — Smallest Images Free · FavGrab',
    description: 'Compress PNG images to next-gen AVIF for the smallest high-quality web files. Transparency kept, adjustable quality, 100% local. Free, no uploads.',
    keywords: 'png to avif, convert png to avif, png to avif converter, compress png to avif, png avif online, smallest image format',
    eyebrow: 'PNG → AVIF',
    h1: 'Convert <span class="hl">PNG</span> to AVIF',
    lead: 'AVIF squeezes images smaller than WebP or JPG while keeping them sharp. Convert your PNGs here to ship the lightest possible web images — all in your browser.',
    intro: [
      'If you want the smallest image files the modern web can deliver, **AVIF** is the format to reach for. It routinely beats both PNG and WebP at the same visual quality, often dramatically for photographic content.',
      'Re-encoding a heavy **PNG** to AVIF can cut its size by half or more while preserving transparency, since AVIF supports a full alpha channel. AVIF is supported in every current major browser, so it’s production-ready — serve it with a WebP or JPG fallback for the oldest clients. The encoding runs locally with WebAssembly, so you can experiment with the quality slider freely; note that AVIF encoding is more CPU-intensive, so large batches take a little longer.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open the FavGrab converter from the button above.' },
      { b: 'Drop your PNGs', text: 'Add one image or a batch of PNGs to optimise.' },
      { b: 'Choose AVIF and tune quality', text: 'Select AVIF, then set the slider — around 60–70 already looks excellent for web images.' },
      { b: 'Convert & compare', text: 'Convert and check the new size next to each file. AVIF encoding takes a moment longer than other formats.' },
    ],
    compareLeft: F.PNG, compareRight: F.AVIF,
    useCases: [
      'Shipping the smallest possible high-quality web images',
      'Squeezing the most out of Core Web Vitals / Lighthouse',
      'Compressing graphics while keeping transparency',
      'Cutting bandwidth on an image-heavy site',
    ],
    faq: [
      { q: 'How much smaller will the AVIF be?', a: ['It varies, but AVIF often lands half the size of a PNG (or smaller) at equal visual quality, with the biggest wins on photographic content. The converter shows each file’s resulting size.'] },
      { q: 'Is AVIF safe to use on my website?', a: ['Yes — every current browser supports it. For the small share of older clients, serve a WebP or JPG fallback using the <picture> element.'] },
      { q: 'Does AVIF keep PNG transparency?', a: ['Yes. AVIF has a full alpha channel, so transparent PNGs convert to transparent AVIF with no background added.'] },
      { q: 'Why does AVIF conversion take longer?', a: ['AVIF uses much heavier compression maths, encoded in WebAssembly in your browser. The extra few seconds per image buys a substantially smaller file.'] },
    ],
    related: ['/convert/png-to-webp', '/convert/jpg-to-avif', '/convert/avif-to-png', '/image-converter'],
    ctaTitle: 'Want the smallest images possible?',
    ctaText: 'Convert PNG to AVIF and ship featherweight files — all in your browser.',
  },

  {
    from: 'JPG', to: 'AVIF',
    title: 'Convert JPG to AVIF — Maximum Compression Free · FavGrab',
    description: 'Compress JPG / JPEG photos to next-gen AVIF for the smallest high-quality files. 100% local in your browser, adjustable quality, batch. Free.',
    keywords: 'jpg to avif, jpeg to avif, convert jpg to avif, compress jpg to avif, jpg avif converter, smallest photo format',
    eyebrow: 'JPG → AVIF',
    h1: 'Convert <span class="hl">JPG</span> to AVIF',
    lead: 'AVIF stores a photo at a fraction of a JPG’s size with no visible loss. Convert your JPGs here for the lightest web images — locally, nothing uploaded.',
    intro: [
      '**JPG** is universal but dated; for the same photo, **AVIF** typically produces a much smaller file at equal quality thanks to far more advanced compression.',
      'Converting JPG → AVIF is one of the easiest wins for a faster, lighter website or a smaller photo archive. AVIF works in every current browser; pair it with a JPG fallback for maximum reach. Everything is encoded on your machine with WebAssembly, so your photos never leave the tab — note that AVIF encoding is heavier on the CPU, so big batches take a little longer to finish.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above.' },
      { b: 'Drop your JPGs', text: 'Add one photo or a whole batch of JPG / JPEG files.' },
      { b: 'Choose AVIF and tune quality', text: 'Select AVIF and set the slider — 60–70 looks great for most photos.' },
      { b: 'Convert & download', text: 'Convert, check the new size, and save each AVIF or grab the set as a ZIP.' },
    ],
    compareLeft: F.JPG, compareRight: F.AVIF,
    useCases: [
      'Serving the lightest possible photos on a website',
      'Improving load times and Core Web Vitals',
      'Shrinking a large photo archive without visible quality loss',
      'Modernising an image pipeline from JPG to AVIF',
    ],
    faq: [
      { q: 'How much smaller will the AVIF be?', a: ['Often far smaller — AVIF frequently halves a JPG’s size (or more) at the same perceived quality. The converter shows each resulting file size so you can confirm.'] },
      { q: 'Is AVIF production-ready?', a: ['Yes — all current browsers support it. Serve a JPG or WebP fallback via <picture> for the small remainder of older clients.'] },
      { q: 'Will I lose quality?', a: ['A JPG is already lossy and AVIF re-encodes it, so there’s a small generational loss. At quality 60–70 it’s visually negligible while the file shrinks dramatically.'] },
      { q: 'Why is AVIF slower to convert?', a: ['AVIF’s advanced compression is more CPU-intensive and runs in WebAssembly in your browser. The extra time per image is the trade-off for a much smaller file.'] },
    ],
    related: ['/convert/jpg-to-webp', '/convert/png-to-avif', '/convert/avif-to-jpg', '/image-converter'],
    ctaTitle: 'Squeeze your photos to the limit',
    ctaText: 'Convert JPG to AVIF for the smallest high-quality files — privately, in your browser.',
  },

  {
    from: 'HEIC', to: 'WebP',
    title: 'Convert HEIC to WebP — Small & Private · FavGrab',
    description: 'Convert iPhone HEIC photos to lightweight WebP for the web. Adjustable quality, 100% local in your browser, batch and ZIP. Free, no uploads.',
    keywords: 'heic to webp, convert heic to webp, heic to webp online, iphone heic to webp, heic webp converter, heic to web image',
    eyebrow: 'HEIC → WebP',
    h1: 'Convert <span class="hl">HEIC</span> to WebP',
    lead: 'Putting iPhone photos on a website? Skip the bloated middle step and convert HEIC straight to compact WebP here — privately, in your browser.',
    intro: [
      'Your iPhone shoots in **HEIC**, which nothing on the web can display directly. The usual fix is to convert to JPG, but if the destination is a website, **WebP** is the smarter target: it loads faster and weighs less at the same quality.',
      'Converting HEIC → WebP in one step skips the heavier JPG or PNG stage entirely, giving you a web-ready image that’s typically 25–35% smaller than the JPG equivalent. Every modern browser supports WebP, so it’s ready to ship. The HEIC decoder loads automatically the first time, and nothing is uploaded — your photos stay on your device.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open the FavGrab converter from the button above — no sign-up needed.' },
      { b: 'Drop your HEIC photos', text: 'Drag one file or a whole batch of iPhone photos in. The HEIC decoder loads on demand the first time.' },
      { b: 'Choose WebP and tune quality', text: 'Select WebP and set the slider — around 80 is an excellent balance for web images.' },
      { b: 'Convert & download', text: 'Convert, check the new size, and save each WebP or grab the set as a ZIP.' },
    ],
    compareLeft: F.HEIC, compareRight: F.WEBP,
    useCases: [
      'Publishing iPhone photos to a website or blog',
      'Building faster-loading image galleries',
      'Smaller uploads that keep their quality',
      'A web image pipeline that starts on an iPhone',
    ],
    faq: [
      { q: 'Why WebP instead of JPG for the web?', a: ['WebP usually produces a smaller file than JPG at the same quality, so pages load faster. For a website it’s the better target; for email or universal compatibility, JPG is still the safe choice.'] },
      { q: 'Will I lose photo quality?', a: ['HEIC is already compressed by the camera. Converting to WebP at quality 80+ keeps the result visually identical for almost any web use, while keeping the file small.'] },
      { q: 'Are my photos uploaded?', a: ['No. Decoding and encoding happen with WebAssembly inside your browser. Your photos never leave your computer or phone.'] },
      { q: 'Does this work on iPhone and iPad?', a: ['Yes — it runs in Safari or Chrome on iOS, so you can convert straight from your phone without an app.'] },
    ],
    related: ['/convert/heic-to-jpg', '/convert/heic-to-png', '/convert/png-to-webp', '/image-converter'],
    ctaTitle: 'Got iPhone photos bound for the web?',
    ctaText: 'Convert HEIC straight to WebP — small, fast, and private in your browser.',
  },

  {
    from: 'GIF', to: 'PNG',
    title: 'Convert GIF to PNG — Free & Lossless · FavGrab',
    description: 'Convert GIF images to lossless PNG in your browser. Get a clean still frame with full colour and transparency. No uploads, batch supported, free.',
    keywords: 'gif to png, convert gif to png, gif to png online, gif frame to png, gif png converter, extract gif frame',
    eyebrow: 'GIF → PNG',
    h1: 'Convert <span class="hl">GIF</span> to PNG',
    lead: 'Turn a GIF into a clean, full-colour PNG still — great for editing, thumbnails, or escaping the GIF’s 256-colour limit. Converts locally, nothing uploaded.',
    intro: [
      '**GIF** is an old format with two big limits: a maximum of 256 colours and only on/off transparency. For a static image those constraints show up as banding and rough, jagged edges. **PNG** removes both — it stores full 24-bit colour and a smooth alpha channel.',
      'Converting GIF → PNG gives you a lossless still you can edit cleanly or hand to a tool that expects PNG. **Note:** this captures the first frame of an animated GIF as a single image — it doesn’t preserve the animation, because PNG is a still format. For a static GIF that’s exactly what you want.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above — no account, no install.' },
      { b: 'Drop the GIF file', text: 'Add one .gif or a batch onto the dropzone.' },
      { b: 'Choose PNG', text: 'Select PNG as the output. There’s no quality setting — PNG is always lossless.' },
      { b: 'Convert & save', text: 'Convert and download your PNG, or grab a ZIP if you converted several.' },
    ],
    compareLeft: F.GIF, compareRight: F.PNG,
    useCases: [
      'Editing a GIF frame cleanly in an image editor',
      'Getting full colour from a 256-colour GIF',
      'Making a still thumbnail from a GIF',
      'Feeding an image into a tool that wants PNG, not GIF',
    ],
    faq: [
      { q: 'Does the PNG keep the animation?', a: ['No — PNG is a still image format, so the converter saves the first frame of an animated GIF as a single picture. To keep motion you’d need an animated format, which this tool doesn’t output.'] },
      { q: 'Does GIF to PNG keep transparency?', a: ['Yes. A transparent GIF converts to a PNG with a transparent background — and PNG’s smooth alpha channel can even look cleaner at the edges.'] },
      { q: 'Is there any quality loss?', a: ['The PNG step is fully lossless. It can’t add colours the GIF never had, but it preserves exactly what’s there with no further loss.'] },
      { q: 'Can I convert several GIFs at once?', a: ['Yes — add a batch, convert them together, and download all the PNGs in a single ZIP.'] },
    ],
    related: ['/convert/png-to-webp', '/convert/png-to-jpg', '/convert/webp-to-png', '/image-converter'],
    ctaTitle: 'Need a clean still from a GIF?',
    ctaText: 'Convert GIF to PNG locally — full colour, lossless, nothing uploaded.',
  },

  {
    from: 'TIFF', to: 'PNG',
    title: 'Convert TIFF to PNG — Free & Lossless · FavGrab',
    description: 'Convert TIFF / TIF scans and images to lossless PNG that opens anywhere. Local, private, no uploads. Batch convert and download as ZIP — free.',
    keywords: 'tiff to png, tif to png, convert tiff to png, tiff to png online, tiff png converter, scan tiff to png',
    eyebrow: 'TIFF → PNG',
    h1: 'Convert <span class="hl">TIFF</span> to PNG',
    lead: 'TIFF scans are huge and won’t open on the web or most phones. Convert them to lossless PNG here — without uploading sensitive documents anywhere.',
    intro: [
      '**TIFF** is the format scanners, fax tools, and print shops produce. It’s lossless and high quality, but the files are enormous and barely supported outside professional software — try opening a `.tif` on a phone or in a browser and it usually fails.',
      'Converting to **PNG** keeps the lossless quality while making the image open literally everywhere, with full transparency support. Since scans often contain documents, IDs, or contracts, doing the conversion **locally** matters: with FavGrab the file never leaves your browser, so nothing sensitive is uploaded to a stranger’s server. The TIFF decoder loads automatically the first time you add one.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above — no sign-up, no install.' },
      { b: 'Drop your TIFF files', text: 'Add one .tif / .tiff or a batch. The TIFF decoder loads on demand the first time.' },
      { b: 'Choose PNG', text: 'Select PNG — it’s lossless, so there’s no quality setting to worry about.' },
      { b: 'Convert & save', text: 'Convert and download each PNG, or grab the whole set as a ZIP.' },
    ],
    compareLeft: F.TIFF, compareRight: F.PNG,
    useCases: [
      'Viewing or sharing a scan on a phone',
      'Opening a TIFF in software that doesn’t support it',
      'Keeping a lossless copy that opens everywhere',
      'Handling sensitive scanned documents privately',
    ],
    faq: [
      { q: 'Is TIFF to PNG lossless?', a: ['Yes — TIFF is typically lossless and the PNG step is lossless too, so every pixel is preserved. PNG just makes the image far more portable than TIFF.'] },
      { q: 'Are my scanned documents uploaded?', a: ['No. The whole conversion runs in your browser with WebAssembly, so private scans, IDs, and contracts never leave your device.'] },
      { q: 'What about a multi-page TIFF?', a: ['The converter renders the first page of the TIFF as a single PNG. For multi-page documents, convert each page you need separately.'] },
      { q: 'Can I convert a batch of TIFFs at once?', a: ['Yes — add as many as you like, convert them together, and download a single ZIP of all the PNGs.'] },
    ],
    related: ['/convert/tiff-to-jpg', '/convert/png-to-jpg', '/convert/heic-to-png', '/image-converter'],
    ctaTitle: 'Got a folder of TIFF scans?',
    ctaText: 'Convert TIFF to PNG locally — lossless, portable, and never uploaded.',
  },

  {
    from: 'TIFF', to: 'JPG',
    title: 'Convert TIFF to JPG — Free, No Upload · FavGrab',
    description: 'Turn large TIFF / TIF scans into compact, shareable JPG files in your browser. No uploads, adjustable quality, batch convert. Completely free.',
    keywords: 'tiff to jpg, tif to jpg, convert tiff to jpg, tiff to jpeg, tiff jpg converter, scan to jpg',
    eyebrow: 'TIFF → JPG',
    h1: 'Convert <span class="hl">TIFF</span> to JPG',
    lead: 'A TIFF scan can be 50 MB. JPG makes it a small, emailable file that opens anywhere. Convert here with quality control — and nothing uploaded.',
    intro: [
      'A single **TIFF** scan can easily run to tens of megabytes — far too large to email, slow to upload, and unopenable on most phones and websites.',
      'Converting to **JPG** shrinks it dramatically into a file anyone can open and share, with a quality slider so you decide how much detail to keep. Because scans frequently hold private documents, the conversion happens entirely in your browser — the file is never uploaded. The TIFF decoder loads on demand the first time you add one.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above — no account needed.' },
      { b: 'Drop your TIFF files', text: 'Add one .tif / .tiff or a batch. The TIFF decoder loads automatically the first time.' },
      { b: 'Choose JPG and set quality', text: 'Pick JPG and adjust the slider — 85–92 is a great balance of size and detail.' },
      { b: 'Convert & download', text: 'Convert, check the new size, and save each JPG or grab the set as a ZIP.' },
    ],
    compareLeft: F.TIFF, compareRight: F.JPG,
    useCases: [
      'Emailing a scan that’s too big as a TIFF',
      'Sharing a scanned document with someone',
      'Uploading to a form or portal that wants JPG',
      'Cutting storage on a folder full of heavy scans',
    ],
    faq: [
      { q: 'What quality setting should I use?', a: ['For document and photo scans, 85–92 looks great while shrinking the file enormously. Lower it for aggressive compression, or push to 100 for maximum fidelity.'] },
      { q: 'How much smaller will the JPG be?', a: ['Usually dramatically — a multi-megabyte TIFF often becomes a JPG a fraction of the size. The converter shows the exact resulting size for each file.'] },
      { q: 'Are my scans kept private?', a: ['Completely. The conversion runs in your browser with no uploads, so sensitive scans never reach a server.'] },
      { q: 'What about a multi-page TIFF?', a: ['The converter renders the first page as a single JPG. Convert additional pages separately if you need them.'] },
    ],
    related: ['/convert/tiff-to-png', '/convert/png-to-jpg', '/convert/webp-to-jpg', '/image-converter'],
    ctaTitle: 'Shrink those TIFF scans',
    ctaText: 'Convert TIFF to JPG with full quality control — privately, in your browser.',
  },

  {
    from: 'BMP', to: 'PNG',
    title: 'Convert BMP to PNG — Free & Lossless · FavGrab',
    description: 'Convert bulky BMP bitmaps to compact, lossless PNG that opens everywhere. Local, private, no uploads. Batch convert and download as ZIP — free.',
    keywords: 'bmp to png, convert bmp to png, bmp to png online, bitmap to png, bmp png converter, bmp to png free',
    eyebrow: 'BMP → PNG',
    h1: 'Convert <span class="hl">BMP</span> to PNG',
    lead: 'BMP files are uncompressed and oversized. PNG keeps every pixel at a fraction of the size and opens anywhere. Convert here — locally, nothing uploaded.',
    intro: [
      '**BMP** is an old Windows bitmap format that stores pixels with little or no compression, so the files are far bigger than they need to be. They also feel out of place on the modern web and in cross-platform workflows.',
      'Converting to **PNG** is almost always an upgrade. PNG is **lossless too**, so no quality is lost, but its compression typically makes the file several times smaller. PNG also opens in every browser, editor, and operating system, where BMP can be awkward. Transparency, if the bitmap has any, is preserved.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above — no sign-up, no install.' },
      { b: 'Drop the BMP files', text: 'Add one .bmp or a whole batch onto the dropzone.' },
      { b: 'Choose PNG', text: 'Select PNG — it’s lossless, so there’s no quality setting to worry about.' },
      { b: 'Convert & save', text: 'Convert and download each PNG, or grab the whole set as a ZIP.' },
    ],
    compareLeft: F.BMP, compareRight: F.PNG,
    useCases: [
      'Shrinking a BMP without losing any quality',
      'Using a legacy bitmap on the modern web',
      'Opening an image reliably across platforms',
      'Modernising old Windows image assets',
    ],
    faq: [
      { q: 'Will I lose quality converting BMP to PNG?', a: ['No. Both formats are lossless, so every pixel is preserved exactly — PNG simply stores it far more efficiently.'] },
      { q: 'How much smaller will the PNG be?', a: ['Often several times smaller, because BMP is essentially uncompressed while PNG applies lossless compression. The converter shows the resulting size for each file.'] },
      { q: 'Are my files uploaded?', a: ['No. The conversion runs entirely in your browser; your images stay on your device.'] },
      { q: 'Can I convert several BMPs at once?', a: ['Yes — add a batch, convert them together, and download all the PNGs in a single ZIP.'] },
    ],
    related: ['/convert/png-to-jpg', '/convert/png-to-webp', '/convert/jpg-to-png', '/image-converter'],
    ctaTitle: 'Modernise those bitmaps',
    ctaText: 'Convert BMP to PNG locally — lossless, smaller, and opens everywhere.',
  },

  {
    from: 'JPG', to: 'ICO',
    title: 'Convert JPG to ICO — Free Favicon Maker · FavGrab',
    description: 'Turn a JPG photo or logo into an ICO favicon or Windows icon. Local, free, no uploads. Generate favicon.ico in your browser in one click.',
    keywords: 'jpg to ico, jpeg to ico, convert jpg to ico, jpg to favicon, favicon from jpg, jpg ico converter',
    eyebrow: 'JPG → ICO',
    h1: 'Convert <span class="hl">JPG</span> to ICO',
    lead: 'Need a `favicon.ico` or Windows icon from a JPG? Generate the ICO right here — no upload, no watermark, no email wall.',
    intro: [
      'Browsers and Windows both use the **ICO** format for favicons and shortcut icons. ICO is a container that holds an icon at the size the system needs, which is why a website’s `favicon.ico` and a desktop app’s icon both rely on it.',
      'If your source art is a **JPG** — a logo export or a photo — this converter turns it into a ready-to-use ICO locally. For the sharpest result, start from a square image (for example 256×256). One thing to keep in mind: JPG can’t store transparency, so the icon will have a solid background; if you need a transparent favicon, convert from a **PNG** instead.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above.' },
      { b: 'Drop a square JPG', text: 'Add your logo or image — a square JPG such as 256×256 gives the crispest icon.' },
      { b: 'Select ICO', text: 'Choose ICO as the output format.' },
      { b: 'Convert & ship', text: 'Convert, download the .ico, and place it at your site root as favicon.ico.' },
    ],
    compareLeft: F.JPG, compareRight: F.ICO,
    useCases: [
      'Generating a favicon.ico from a logo saved as JPG',
      'Creating a Windows application or shortcut icon',
      'Producing a quick icon from a photo',
      'Replacing a placeholder favicon with your own mark',
    ],
    faq: [
      { q: 'What size JPG should I use for a favicon?', a: ['A square JPG of 256×256 (or at least 64×64) works well. Starting square avoids stretching, and a larger source stays sharp when the browser scales it down to 16×16 or 32×32.'] },
      { q: 'Can I get a transparent favicon from a JPG?', a: ['No — JPG can’t store transparency, so the icon keeps a solid background. For a transparent favicon, start from a PNG and use the PNG to ICO converter instead.'] },
      { q: 'Where do I put the favicon.ico?', a: ['Place the converted file at the root of your website as `favicon.ico`. Most browsers request it automatically; you can also reference it with a `<link rel="icon">` tag.'] },
      { q: 'Is anything uploaded to make the ICO?', a: ['No. The ICO is built in your browser from your JPG — nothing is sent to a server.'] },
    ],
    related: ['/convert/png-to-ico', '/convert/jpg-to-png', '/convert/png-to-jpg', '/image-converter'],
    ctaTitle: 'Build your favicon now',
    ctaText: 'Convert a JPG into a ready-to-ship ICO — locally and free.',
  },

  {
    from: 'JFIF', to: 'PNG',
    title: 'Convert JFIF to PNG — Free & Lossless · FavGrab',
    description: 'Turn a stubborn .jfif file into a clean PNG that opens anywhere. 100% in your browser, no uploads, batch and ZIP supported. Completely free.',
    keywords: 'jfif to png, convert jfif to png, jfif to png online, open jfif file, jfif png converter, what is a jfif file',
    eyebrow: 'JFIF → PNG',
    h1: 'Convert <span class="hl">JFIF</span> to PNG',
    lead: 'Downloaded an image and got a `.jfif` your software won’t open? Convert it to a universal, lossless PNG here — instantly, with nothing uploaded.',
    intro: [
      'A **JFIF** file is not some exotic format — it *is* a JPEG. “JFIF” (JPEG File Interchange Format) is the standard container JPEGs have always used, and Windows and Chrome occasionally save images with the `.jfif` extension instead of `.jpg`. The pixels are identical; only the name is unfamiliar, which is exactly why double-clicking one sometimes throws an error.',
      'Converting to **PNG** gives you a file that opens in every viewer, editor, and document without question. PNG is lossless, so from this point on no further detail is shed, and if you later need a transparent background you’ll be able to add one — something JPEG/JFIF can never store. The PNG will be larger than the JFIF; that’s the cost of lossless, universal compatibility.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Click the button above to open FavGrab — no sign-up, no install.' },
      { b: 'Drop the JFIF file', text: 'Drag the .jfif image onto the dropzone, or add a whole batch at once.' },
      { b: 'Choose PNG', text: 'Select PNG as the output. There’s no quality setting — PNG is always lossless.' },
      { b: 'Convert & save', text: 'Convert and download your PNG, or grab a ZIP if you converted several.' },
    ],
    compareLeft: F.JFIF, compareRight: F.PNG,
    useCases: [
      'Opening a .jfif that your image viewer refuses to recognise',
      'Editing the image cleanly in software that expects PNG',
      'Keeping a lossless copy before further edits',
      'Preparing an image you’ll later give a transparent background',
    ],
    faq: [
      { q: 'What exactly is a JFIF file?', a: ['It’s a JPEG. JFIF is the standard interchange format JPEGs are saved in, and some browsers and Windows builds simply use the .jfif extension instead of .jpg. The image data is the same — only the file name differs.'] },
      { q: 'Is JFIF to PNG lossless?', a: ['The PNG step is fully lossless and preserves every pixel decoded from the JFIF. Note the JFIF was already a lossy JPEG out of the camera or export, so PNG can’t recover detail that was discarded — it simply stops any further loss.'] },
      { q: 'Does converting add transparency?', a: ['Conversion alone won’t remove a background, but once the image is a PNG you can erase the background in an editor and save the transparency, which JFIF could never hold.'] },
      { q: 'Are my files uploaded?', a: ['No. The conversion runs entirely in your browser; your images never reach a server.'] },
    ],
    related: ['/convert/jfif-to-jpg', '/convert/png-to-jfif', '/convert/jpg-to-png', '/image-converter'],
    ctaTitle: 'Stuck with a .jfif you can’t open?',
    ctaText: 'Turn it into a universal PNG in seconds — privately, in your browser.',
  },

  {
    from: 'JFIF', to: 'JPG',
    title: 'Convert JFIF to JPG — Fix the Extension Free · FavGrab',
    description: 'Rename a confusing .jfif file to a standard .jpg that opens everywhere. Same image, friendly extension. 100% local in your browser, batch supported, free.',
    keywords: 'jfif to jpg, jfif to jpeg, convert jfif to jpg, change jfif to jpg, jfif to jpg online, why is my image a jfif',
    eyebrow: 'JFIF → JPG',
    h1: 'Convert <span class="hl">JFIF</span> to JPG',
    lead: 'A `.jfif` and a `.jpg` are the same kind of file — JPEG. Convert here to get the familiar `.jpg` extension that every app and upload form expects, without uploading anything.',
    intro: [
      'If a download landed on your disk as **JFIF**, you don’t have a broken or unusual image — you have a **JPEG with an awkward extension**. JFIF (JPEG File Interchange Format) is the very container JPEGs are stored in; Chrome and some Windows versions just label the file `.jfif` instead of `.jpg`. The bytes are identical.',
      'The catch is that plenty of apps, websites, and email clients only recognise `.jpg` or `.jpeg` and balk at `.jfif`. This converter re-saves the image as a standard **JPG** so it drops cleanly into any inbox, form, or editor. Because both are JPEG, you can keep the quality slider at 100 for an essentially identical copy — you’re really just giving the file the extension the rest of the world expects.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above — no account, no install.' },
      { b: 'Drop the JFIF file', text: 'Add one .jfif image or a whole batch onto the dropzone.' },
      { b: 'Choose JPG', text: 'Pick JPG and leave quality high (95–100) for a near-identical copy.' },
      { b: 'Convert & download', text: 'Convert, then save each .jpg or grab the whole set as a single ZIP.' },
    ],
    compareLeft: F.JFIF, compareRight: F.JPG,
    useCases: [
      'Uploading to a form or website that rejects the .jfif extension',
      'Attaching an image to an email client that won’t accept .jfif',
      'Opening the file in an app that only recognises .jpg',
      'Tidying a folder so every photo uses the familiar .jpg name',
    ],
    faq: [
      { q: 'What’s the difference between JFIF and JPG?', a: ['Essentially none. JFIF is the standard format JPEG images are stored in, and .jpg / .jpeg / .jfif all wrap the same kind of data. The .jfif extension just appears less often, which is why some apps don’t recognise it.'] },
      { q: 'Will I lose quality converting JFIF to JPG?', a: ['Both are JPEG, so at quality 95–100 the result is visually identical to the original. There is a tiny re-encode, but it’s imperceptible at high quality settings.'] },
      { q: 'Why did my image save as .jfif instead of .jpg?', a: ['It’s a known quirk of how Windows registers the JPEG image type — some Chrome and Windows combinations write JPEGs with a .jfif extension. The file is fine; only the extension is unusual.'] },
      { q: 'Are my files uploaded?', a: ['No. The conversion runs entirely in your browser, so your images never leave your device.'] },
    ],
    related: ['/convert/jfif-to-png', '/convert/jpg-to-jfif', '/convert/jfif-to-webp', '/image-converter'],
    ctaTitle: 'Need a normal .jpg?',
    ctaText: 'Convert JFIF to JPG in seconds — privately, in your browser.',
  },

  {
    from: 'JFIF', to: 'WebP',
    title: 'Convert JFIF to WebP — Smaller & Web-Ready · FavGrab',
    description: 'Turn a .jfif image into a lightweight WebP for faster websites. Adjustable quality, 100% local in your browser, batch and ZIP. Free, no uploads.',
    keywords: 'jfif to webp, convert jfif to webp, jfif to webp online, jfif webp converter, compress jfif, jfif to web image',
    eyebrow: 'JFIF → WebP',
    h1: 'Convert <span class="hl">JFIF</span> to WebP',
    lead: 'Putting that `.jfif` on a website? Convert it straight to compact WebP here — smaller files, faster pages, and nothing uploaded.',
    intro: [
      'A **JFIF** file is a JPEG with an unusual extension, and like any JPEG it isn’t the most efficient choice for the modern web. **WebP** stores the same image at a noticeably smaller size — typically 25–35% lighter at the same visual quality — which means faster page loads and lower bandwidth.',
      'Converting JFIF → WebP gives you a clean, web-ready file with a sensible name, ready to drop into any site. Every current browser has supported WebP since 2020, so it’s safe to ship today. Use the quality slider to balance crispness against size; because it all runs locally, you can experiment freely without re-uploading anything.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open the FavGrab converter from the button above — no sign-up needed.' },
      { b: 'Drop your JFIF files', text: 'Add one .jfif image or a whole batch to optimise.' },
      { b: 'Choose WebP and tune quality', text: 'Select WebP and set the slider — around 80 is an excellent balance for web images.' },
      { b: 'Convert & compare', text: 'Convert and check the new size shown next to each file before downloading.' },
    ],
    compareLeft: F.JFIF, compareRight: F.WEBP,
    useCases: [
      'Publishing a downloaded .jfif to a website or blog',
      'Shrinking image payloads to improve Core Web Vitals',
      'Serving smaller photos without a visible quality drop',
      'Replacing an oddly-named .jfif with a clean web asset',
    ],
    faq: [
      { q: 'Why convert JFIF to WebP instead of JPG?', a: ['For the web, WebP usually produces a smaller file than JPEG (which is what JFIF is) at the same quality, so pages load faster. If you just need universal compatibility instead, convert JFIF to JPG.'] },
      { q: 'Will I lose quality?', a: ['A JFIF is already a lossy JPEG, and WebP re-encodes it, so there’s a small generational loss. At quality 80 or above it’s visually negligible while the file gets meaningfully smaller.'] },
      { q: 'Is WebP safe to use on my site?', a: ['Yes — every current browser (Chrome, Edge, Firefox, Safari) has supported WebP for years. It’s a standard production choice.'] },
      { q: 'Are my files uploaded?', a: ['No. Decoding and encoding happen in your browser with Canvas and WebAssembly; your images never leave your device.'] },
    ],
    related: ['/convert/jfif-to-png', '/convert/jfif-to-jpg', '/convert/jpg-to-webp', '/image-converter'],
    ctaTitle: 'Got a .jfif bound for the web?',
    ctaText: 'Convert JFIF straight to WebP — small, fast, and private in your browser.',
  },

  {
    from: 'PNG', to: 'JFIF',
    title: 'Convert PNG to JFIF — Free, No Upload · FavGrab',
    description: 'Convert PNG images to JFIF (standard JPEG) with an adjustable quality slider. 100% local in your browser, batch and ZIP supported. Free, no uploads.',
    keywords: 'png to jfif, convert png to jfif, png to jfif online, png jfif converter, save png as jfif, make a jfif file',
    eyebrow: 'PNG → JFIF',
    h1: 'Convert <span class="hl">PNG</span> to JFIF',
    lead: 'Need a `.jfif` file specifically — because a system or form asked for one? Convert your PNG here. JFIF is just JPEG, produced locally with a quality slider you control.',
    intro: [
      '**JFIF** is the standard container for **JPEG** images, so converting PNG → JFIF is really PNG → JPEG with a `.jfif` extension. People usually land here because a particular upload form, legacy system, or assignment explicitly asked for a `.jfif` file, even though it’s the same format as a `.jpg`.',
      'The conversion compresses your PNG into a small, lossy JFIF and flattens any transparency onto a solid background, exactly as JPEG does — JFIF has no alpha channel. Use the quality slider to balance file size against clarity. It all happens in your browser, so you can re-try until the size and look are right without uploading anything.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open the FavGrab converter from the button above.' },
      { b: 'Drop your PNGs', text: 'Add one image or a whole batch onto the dropzone.' },
      { b: 'Choose JFIF and set quality', text: 'Pick JFIF and adjust the quality slider — 85–92 is a great default for most images.' },
      { b: 'Convert & download', text: 'Convert, check the new size, and save each .jfif or grab the set as a ZIP.' },
    ],
    compareLeft: F.PNG, compareRight: F.JFIF,
    useCases: [
      'Satisfying a form or system that specifically requires a .jfif file',
      'Shrinking a large PNG into a compact, shareable image',
      'Producing a JPEG-format file with the exact extension requested',
      'Compressing screenshots or exports that have no transparency to keep',
    ],
    faq: [
      { q: 'Is JFIF different from JPG?', a: ['Not in any meaningful way — JFIF is the standard format JPEG files are saved in. A .jfif and a .jpg hold the same kind of data; the extension is the only difference. We output the .jfif name when you choose JFIF.'] },
      { q: 'What happens to my PNG’s transparency?', a: ['JFIF is JPEG, which can’t store transparency, so any transparent areas are filled with a solid background during conversion. If you need to keep transparency, convert to WebP or stay with PNG instead.'] },
      { q: 'What quality should I use?', a: ['For most images, 85–92 looks indistinguishable from the original while keeping the file small. Push to 100 for maximum fidelity, or lower for aggressive compression.'] },
      { q: 'Are my files uploaded?', a: ['No. Everything is encoded in your browser, so your images never reach a server.'] },
    ],
    related: ['/convert/jpg-to-jfif', '/convert/jfif-to-png', '/convert/png-to-jpg', '/image-converter'],
    ctaTitle: 'Need a .jfif from your PNG?',
    ctaText: 'Convert PNG to JFIF with full quality control — privately, in your browser.',
  },

  {
    from: 'JPG', to: 'JFIF',
    title: 'Convert JPG to JFIF — Free & Instant · FavGrab',
    description: 'Convert a JPG / JPEG to a .jfif file when a system asks for that exact extension. Same JPEG data, 100% local in your browser. Batch supported, free.',
    keywords: 'jpg to jfif, jpeg to jfif, convert jpg to jfif, change jpg to jfif, jpg to jfif online, rename jpg to jfif',
    eyebrow: 'JPG → JFIF',
    h1: 'Convert <span class="hl">JPG</span> to JFIF',
    lead: 'When something insists on a `.jfif` file, convert your JPG here. They’re the same JPEG format — you just get the `.jfif` extension, produced locally with nothing uploaded.',
    intro: [
      '**JPG** and **JFIF** are two extensions for the same thing: a JPEG image stored in the JPEG File Interchange Format. So converting JPG → JFIF doesn’t change the format at all — it gives the file the `.jfif` name that a specific tool, portal, or assignment has asked for.',
      'Because no format change is involved, you can keep quality at 100 for an essentially identical copy; the converter simply re-encodes the JPEG and saves it with a `.jfif` extension. Everything runs in your browser, so even a batch of photos stays entirely on your device.',
    ],
    steps: [
      { b: 'Open the converter', text: 'Open FavGrab from the button above — no account needed.' },
      { b: 'Drop your JPG files', text: 'Add one .jpg / .jpeg image or a whole batch onto the dropzone.' },
      { b: 'Choose JFIF', text: 'Pick JFIF and leave quality high (95–100) for a near-identical copy.' },
      { b: 'Convert & download', text: 'Convert, then save each .jfif or grab the whole set as a single ZIP.' },
    ],
    compareLeft: F.JPG, compareRight: F.JFIF,
    useCases: [
      'Meeting a requirement for a .jfif file specifically',
      'Submitting to a portal or system that expects the .jfif extension',
      'Matching an assignment or template that calls for .jfif',
      'Producing the .jfif name without changing the underlying image',
    ],
    faq: [
      { q: 'Does converting JPG to JFIF change the image?', a: ['Barely — JFIF is the same JPEG format, so at high quality the result is visually identical. You’re mostly changing the extension from .jpg to .jfif.'] },
      { q: 'Why would I need a JFIF file?', a: ['Usually because a particular upload form, legacy application, or assignment explicitly asks for .jfif. Functionally it’s the same as a JPG, but some systems request that exact extension.'] },
      { q: 'Will quality drop?', a: ['Keep the slider at 95–100 and the re-encode is imperceptible. There’s a tiny generational loss inherent to any JPEG re-save, negligible at high quality.'] },
      { q: 'Are my files uploaded?', a: ['No. The conversion runs entirely in your browser, so your images never leave your device.'] },
    ],
    related: ['/convert/png-to-jfif', '/convert/jfif-to-jpg', '/convert/jpg-to-png', '/image-converter'],
    ctaTitle: 'Need that .jfif extension?',
    ctaText: 'Convert JPG to JFIF in seconds — privately, in your browser.',
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
  description: 'Free online image converter that runs entirely in your browser. Convert PNG, JPG, WebP, AVIF, HEIC, TIFF, BMP and ICO with no uploads, no signup, offline-ready.',
  keywords: 'image converter, free image converter, online image converter, convert image format, png jpg webp avif heic converter, image converter no upload, offline image converter, batch image converter',
  eyebrow: 'Image Converter',
  h1: 'The <span class="hl">image converter</span> that never uploads your files',
  lead: 'Convert between PNG, JPG, WebP, AVIF, HEIC, TIFF, BMP and ICO — entirely inside your browser. No account, no upload, no watermark. Works offline once loaded.',
  intro: [
    'Most “online” image converters quietly upload your pictures to a server, process them there, and hand back a download. That means waiting on your connection, trusting a stranger with your files, and hitting size or batch limits when the free tier runs out.',
    'FavGrab takes the opposite approach: **every conversion happens on your own machine**. It uses the browser’s built-in Canvas APIs plus lazy-loaded WebAssembly codecs (libheif for HEIC, utif2 for TIFF, jSquash for AVIF) so your files never leave the tab. The result is faster, completely private, and free with no limits — convert one image or a hundred, online or offline.',
  ],
  formatsIn: ['PNG', 'JPG', 'JFIF', 'WebP', 'AVIF', 'GIF', 'BMP', 'ICO', 'HEIC', 'HEIF', 'TIFF'],
  formatsOut: ['PNG', 'JPG', 'JFIF', 'WebP', 'AVIF', 'BMP', 'ICO'],
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
    '/convert/webp-to-jpg',
    '/convert/png-to-jpg',
    '/convert/jpg-to-webp',
    '/convert/png-to-webp',
    '/convert/avif-to-png',
    '/convert/jfif-to-jpg',
    '/convert/png-to-ico',
  ],
  // Full internal-link list — every generated guide, so the hub links to the
  // whole set for crawlability. Built from `pages` above.
  allConversions: pages.map(p => p.url),
  faq: [
    { q: 'Is this image converter really free?', a: ['Yes — completely free with no signup, no watermark, and no paid tier. Because conversions run in your browser there are no server costs to recoup, so there’s nothing to upsell.'] },
    { q: 'Are my images uploaded anywhere?', a: ['No. Every image is decoded and re-encoded locally using your browser’s Canvas and WebAssembly. Your files never touch a server, which makes the tool both private and fast.'] },
    { q: 'Which formats can I convert between?', a: ['You can open PNG, JPG, JFIF, WebP, AVIF, GIF, BMP, ICO, HEIC, HEIF and TIFF, and export to PNG, JPG, JFIF, WebP, AVIF, BMP or ICO. HEIC and TIFF decoders load automatically the first time you need them.'] },
    { q: 'Can I convert multiple images at once?', a: ['Yes. Drop a whole batch, convert them in one pass, and download everything as a single ZIP archive.'] },
    { q: 'Does it work offline?', a: ['Yes. After your first visit the converter is cached, so it keeps working with no internet connection at all.'] },
    { q: 'Will converting reduce my image quality?', a: ['Lossless targets like PNG keep every pixel. For lossy targets (JPG, WebP, AVIF) you control fidelity with the quality slider, and the tool shows the resulting file size so you can pick the right balance.'] },
  ],
  ctaTitle: 'Convert an image right now',
  ctaText: 'Open the converter, drop your files, and download — nothing ever leaves your browser.',
}

export const allPages = [hub, ...pages]
