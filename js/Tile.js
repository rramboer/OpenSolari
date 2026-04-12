import { CHARSET, FLIP_DURATION } from './constants.js';

export class Tile {
  constructor() {
    this.currentChar = ' ';
    this._delayTimer = null;
    this._animating = false;
    this._flipped = false;
    // Cumulative rotation so we always flip forward (like a real drum)
    this._rotation = 0;

    this.el = document.createElement('div');
    this.el.className = 'tile';

    this.innerEl = document.createElement('div');
    this.innerEl.className = 'tile-inner';

    this.frontEl = document.createElement('div');
    this.frontEl.className = 'tile-front';
    this.frontSpan = document.createElement('span');
    this.frontEl.appendChild(this.frontSpan);

    this.backEl = document.createElement('div');
    this.backEl.className = 'tile-back';
    this.backSpan = document.createElement('span');
    this.backEl.appendChild(this.backSpan);

    this.innerEl.appendChild(this.frontEl);
    this.innerEl.appendChild(this.backEl);
    this.el.appendChild(this.innerEl);
  }

  setChar(char) {
    this.currentChar = char;
    this.frontSpan.textContent = char === ' ' ? '' : char;
    this.backSpan.textContent = '';
  }

  // Build the sequence of characters the drum must flip through
  // to get from current to target, then chain-flip through each one
  flipTo(targetChar, delay, onComplete) {
    if (targetChar === this.currentChar) {
      if (onComplete) onComplete();
      return;
    }

    if (this._delayTimer) {
      clearTimeout(this._delayTimer);
      this._delayTimer = null;
    }

    const sequence = this._buildSequence(targetChar);

    this._delayTimer = setTimeout(() => {
      this.el.classList.add('scrambling');
      this._chainFlip(sequence, 0, onComplete);
    }, delay);
  }

  // Get ordered characters from current to target going forward through the drum
  _buildSequence(targetChar) {
    const from = CHARSET.indexOf(this.currentChar.toUpperCase());
    const to = CHARSET.indexOf(targetChar.toUpperCase());

    // If character not in charset, just flip directly
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

  _chainFlip(sequence, index, onComplete) {
    if (index >= sequence.length) {
      this.el.classList.remove('scrambling');
      if (onComplete) onComplete();
      return;
    }

    const char = sequence[index];

    this._hiddenSpan().textContent = char === ' ' ? '' : char;

    this._rotation -= 180;
    this.innerEl.style.transition = `transform ${FLIP_DURATION}ms ease-in`;
    this.innerEl.style.transform = `rotateX(${this._rotation}deg)`;

    const onDone = () => {
      this.innerEl.removeEventListener('transitionend', onDone);
      this._flipped = !this._flipped;
      this.currentChar = char;
      this._chainFlip(sequence, index + 1, onComplete);
    };
    this.innerEl.addEventListener('transitionend', onDone);
  }

  _hiddenSpan() {
    return this._flipped ? this.frontSpan : this.backSpan;
  }
}
