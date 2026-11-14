# Phûut Thai

A speaking-and-listening Thai course in a single HTML file. No alphabet, no install, no account.

## Install on Android (one-time)

1. In this repo on GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**, pick the branch that holds `index.html`, folder `/ (root)`, Save.
2. After a minute, open `https://nicolasbrocard.github.io/thai-language-app/` in Chrome on the phone.
3. Chrome menu **⋮ → Add to Home screen → Install**. It then opens full-screen like an app and works offline.

- **Audio:** the phone's built-in Thai voice. If none is found, the app shows how to install one.
- **Speaking check:** Chrome's Thai speech recognition (asks for the microphone once); otherwise you self-check against the model.
- **Progress:** saved on the phone automatically. Settings has a backup code to copy out and restore on another device.

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
