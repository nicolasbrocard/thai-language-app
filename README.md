# Phûut Thai

A speaking-and-listening Thai course in a single HTML file. No alphabet, no install, no account.

- **Use it:** open `index.html` on any HTTPS host (GitHub Pages works) in Safari on iPhone or Chrome on Android, then "Add to Home Screen".
- **Audio:** your phone's built-in Thai voice. If the app says no Thai voice is found, it shows how to install one.
- **Speaking check:** uses the browser's Thai speech recognition where available (needs HTTPS and microphone permission); otherwise you self-check against the model.
- **Progress:** stored in the browser on that device.

## How it teaches

| Borrowed from | What the app does |
|---|---|
| Pimsleur | Audio first, recall out loud before the answer, hands-free "listen and repeat" mode |
| Rosetta Stone | Sound-to-meaning matching with pictures, no text until you answer |
| Duolingo | 5-minute lessons, mixed exercise types, mistakes recycled, streak and daily goal |
| Michel Thomas / Babbel | One grammar pattern per lesson, then new sentences built from known words; real dialogues with role-play |
| Anki | Spaced repetition: items return after 1, 2, 4, 8, 16, 32, 64 days |

10 units, 30 lessons, about 390 words and sentences, 10 dialogues.

## Develop

Edit `src/` (`content.js` holds the whole course), then:

```bash
node build.mjs
```
