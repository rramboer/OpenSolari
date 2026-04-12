import { CHARSET, FLIP_DURATION } from './constants.js';

export class Tile {
  constructor() {
    this.currentChar = ' ';
    this._delayTimer = null;
    this._cycleTimer = null;

    this.el = document.createElement('div');
    this.el.className = 'tile';

    this.span = document.createElement('span');
    this.el.appendChild(this.span);
  }

  setChar(char) {
    this.currentChar = char;
    this.span.textContent = char === ' ' ? '' : char;
  }

  flipTo(targetChar, delay, onComplete) {
    if (targetChar === this.currentChar) {
      if (onComplete) onComplete();
      return;
    }

    if (this._delayTimer) clearTimeout(this._delayTimer);
    if (this._cycleTimer) clearInterval(this._cycleTimer);

    const sequence = this._buildSequence(targetChar);
    let index = 0;

    this._delayTimer = setTimeout(() => {
      this._cycleTimer = setInterval(() => {
        this.span.textContent = sequence[index] === ' ' ? '' : sequence[index];
        index++;

        if (index >= sequence.length) {
          clearInterval(this._cycleTimer);
          this._cycleTimer = null;
          this.currentChar = targetChar;
          if (onComplete) onComplete();
        }
      }, FLIP_DURATION);
    }, delay);
  }

  _buildSequence(targetChar) {
    const from = CHARSET.indexOf(this.currentChar.toUpperCase());
    const to = CHARSET.indexOf(targetChar.toUpperCase());

    if (from === -1 || to === -1) return [targetChar];

    const sequence = [];
    let i = (from + 1) % CHARSET.length;
    while (i !== to) {
      sequence.push(CHARSET[i]);
      i = (i + 1) % CHARSET.length;
    }
    sequence.push(targetChar);
    return sequence;
  }
}
