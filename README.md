# FlipOff.

**Turn any TV into a retro split-flap display.** Free and open-source.

## What is this?

FlipOff is a web app that emulates a classic mechanical split-flap display — the kind you'd see at train stations and airports. Designed to run fullscreen on a TV via a Raspberry Pi or any browser.

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
flipoff/
  index.html          — Single-page app
  css/
    style.css         — All styles
  js/
    main.js           — Entry point
    Board.js          — Grid manager and transition orchestration
    Tile.js           — Individual tile animation logic
    SoundEngine.js    — Audio playback with Web Audio API
    flapAudio.js      — Embedded audio data (base64)
    MessageRotator.js — Quote rotation timer
    KeyboardController.js — Keyboard shortcut handling
    constants.js      — Configuration (grid size, colors, quotes)
```

## Customization

Edit `js/constants.js` to change:
- **Messages**: Add your own quotes or text (5 rows, max 22 chars per row)
- **Grid size**: Adjust `GRID_COLS` and `GRID_ROWS`
- **Timing**: Tweak `FLIP_DURATION`, `STAGGER_DELAY`, etc.

## License

MIT
