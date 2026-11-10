# Free guide — Editorial design (Nov 2026)

Served PDFs: `content/guides/famed-study-guide-<locale>.pdf` for en, es, ar, de, ru, fr, tr (30 pages each).
Content: `i18n/content_<locale>.py` (C = chapters, WEEKS = daily sessions, UI = interface strings). Spanish is the master;
`i18n/check_i18n.py <loc>` checks a translation keeps the same structure, URLs and German example phrases.
German case lists come from `../translations.py`.

Build (macOS, Python 3 + PyMuPDF, Google Chrome): the working copy lives on the SanDisk at
`/Volumes/SanDisk/AEE/video-work/famed-guide` (with `assets/`: Klassik book cover renders, Inter/Manrope/Lato fonts;
book cover source in `../famed-book-cover`). Run `python3 build_guide.py es en ar de ru fr tr` then `./render_loc.sh <locs>`
(headless Chrome print-to-PDF; prints a fit report — "ok" means no page needed shrinking). `gen_designs.py`/`gen_full.py`
hold the five design options shown to Felipe; the build uses the Editorial skin.

Every PDF links to the book (PayPal, utm_campaign=guide_book_<locale>) on the cover, the contents page, every page footer
and the book/app page, and to a free app case (famedtestprep.com/dashboard, utm_locale=<locale>).
The download route picks the PDF by `&lang=` (page language, de/ru/fr/tr) or the stored en/ar/es locale.
