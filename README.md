# Suneththa's 21st Birthday Website 🎂💗

A premium, animated, single-page birthday surprise site. Open `index.html` in any
browser, or upload the whole folder to any static host (Netlify, GitHub Pages, etc).

## Project structure
```
suneththa-birthday/
├── index.html          → all 7 pages + modal + markup
├── style.css            → design tokens, layout, animations, dark mode
├── script.js             → interactions, confetti, fireworks, typewriter, game
└── assets/
    ├── images/           → put real photos here (and video poster image)
    ├── music/             → put birthday-song.mp3 and celebration.mp3 here
    ├── videos/            → put birthday-video.mp4 here
    └── icons/             → optional custom icons / favicon
```

## Things you'll likely want to customize

| What | Where |
|---|---|
| Hero photo | `index.html` → `.welcome-image` `src` |
| Birthday letter text | `script.js` → `initTypewriter()` → `message` variable |
| 8 gallery photos | `index.html` → `.gallery-grid` → replace each `src` with `assets/images/photo1.jpg` etc. |
| Local video | Add `assets/videos/birthday-video.mp4` — customize `poster` attribute of `#birthday-video` in `index.html` if desired |
| Which gift box is correct | `script.js` → `initGiftGame()` → `correctGift` (`'1'`, `'2'`, or `'3'`) |
| Background music | Add `assets/music/birthday-song.mp3` |
| Candle-blow sound | Add `assets/music/celebration.mp3` |
| Colors / fonts | `style.css` → `:root` design tokens at the top of the file |
| Final message | `index.html` → `.page-final` section |

## Notes
- All photo placeholders use [placehold.co](https://placehold.co) so nothing breaks if you forget to swap an image — just replace the `src` with your own file or URL.
- Dark/light mode and the music on/off state are remembered between visits (via `localStorage`).
- The candle, gift boxes, and final page each trigger a canvas-based fireworks + confetti celebration — no external fireworks library needed.
- Works fully offline once fonts and icons are cached.
- Respects `prefers-reduced-motion` for accessibility.
