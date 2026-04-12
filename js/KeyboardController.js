export class KeyboardController {
  constructor(rotator, soundEngine) {
    this.rotator = rotator;
    this.soundEngine = soundEngine;
    this._audioInitialized = false;

    document.addEventListener('keydown', (e) => this._handleKey(e));
  }

  async _initAudio() {
    if (this._audioInitialized || !this.soundEngine) return;
    this._audioInitialized = true;
    await this.soundEngine.init();
    this.soundEngine.resume();
  }

  _handleKey(e) {
    this._initAudio();

    switch (e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowRight':
        e.preventDefault();
        this.rotator.next();
        break;

      case 'ArrowLeft':
        e.preventDefault();
        this.rotator.prev();
        break;

      case 'm':
      case 'M':
        e.preventDefault();
        if (this.soundEngine) {
          this.soundEngine.toggleMute();
        }
        break;
    }
  }
}
