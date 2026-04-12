# OpenSolari

**Turn any TV into a split-flap display.** Free and open-source.

## What is this?

OpenSolari is a web app that emulates a classic Solari split-flap display — the kind you'd see at train stations and airports. Each tile flips through characters one by one, just like the real mechanical boards. Designed to run fullscreen on a TV via a Raspberry Pi or any browser.

No accounts. No subscriptions. Just open `index.html` and go.

## Quick Start

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` / `Space` / `Arrow Right` | Next message |
| `Arrow Left` | Previous message |
| `M` | Toggle mute |

## File Structure

```
OpenSolari/
  index.html          — Single-page app
  css/
    style.css         — All styles
  js/
    main.js           — Entry point
    Board.js          — Grid manager and transition orchestration
    Tile.js           — Individual tile flip animation
    SoundEngine.js    — Audio playback with Web Audio API
    flapAudio.js      — Embedded audio data (base64)
    MessageRotator.js — Message rotation timer
    KeyboardController.js — Keyboard shortcut handling
    constants.js      — Configuration (grid size, timing, messages)
```

## Customization

Edit `js/constants.js` to change:
- **Messages**: Add your own text (max `GRID_ROWS` rows, max `GRID_COLS` chars per row)
- **Grid size**: Adjust `GRID_COLS` and `GRID_ROWS`
- **Timing**: Tweak `FLIP_DURATION`, `STAGGER_DELAY`, `MESSAGE_INTERVAL`

## License

MIT
