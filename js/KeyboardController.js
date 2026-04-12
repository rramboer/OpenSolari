export class KeyboardController {
  constructor(rotator) {
    this.rotator = rotator;
    document.addEventListener('keydown', (e) => this._handleKey(e));
  }

  _handleKey(e) {
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
    }
  }
}
