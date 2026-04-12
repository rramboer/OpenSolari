const GRID_COLS = 22;
const GRID_ROWS = 7;

const FLIP_DURATION = 100;
const STAGGER_DELAY = 0;
const MESSAGE_INTERVAL = 2000;

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,-!?\' ';

const MESSAGES = [
  [
    '',
    'THE TIME IS NOW',
    '',
    'MAKE IT COUNT',
    ''
  ],
  [
    '',
    'WELCOME',
    '',
    'WE\'RE GLAD YOU\'RE HERE',
    ''
  ],
  [
    '',
    'STAY CURIOUS',
    'ASK QUESTIONS',
    'BUILD THINGS',
    ''
  ],
  [
    '',
    'GOOD DESIGN IS',
    'AS LITTLE DESIGN',
    'AS POSSIBLE',
    ''
  ],
  [
    '',
    'SIMPLICITY IS THE',
    'ULTIMATE',
    'SOPHISTICATION',
    ''
  ],
  [
    '',
    'THINK DIFFERENT',
    '',
    '',
    ''
  ],
  [
    '',
    'MOVE FAST',
    'BREAK NOTHING',
    '',
    ''
  ],
  [
    '',
    'THE BEST WAY TO',
    'PREDICT THE FUTURE',
    'IS TO CREATE IT',
    ''
  ],
  [
    '',
    'DONE IS BETTER',
    'THAN PERFECT',
    '',
    ''
  ],
  [
    'NOW SERVING',
    '',
    'GATE 42',
    '',
    'ON TIME'
  ],
];

class Tile {
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

class Board {
  constructor(containerEl) {
    this.cols = GRID_COLS;
    this.rows = GRID_ROWS;
    this.isTransitioning = false;
    this.tiles = [];
    this.currentGrid = [];

    this.boardEl = document.createElement('div');
    this.boardEl.className = 'board';
    this.boardEl.style.setProperty('--grid-cols', this.cols);
    this.boardEl.style.setProperty('--grid-rows', this.rows);

    this.gridEl = document.createElement('div');
    this.gridEl.className = 'tile-grid';

    for (let r = 0; r < this.rows; r++) {
      const row = [];
      const charRow = [];
      for (let c = 0; c < this.cols; c++) {
        const tile = new Tile();
        tile.setChar(' ');
        this.gridEl.appendChild(tile.el);
        row.push(tile);
        charRow.push(' ');
      }
      this.tiles.push(row);
      this.currentGrid.push(charRow);
    }

    this.boardEl.appendChild(this.gridEl);
    containerEl.appendChild(this.boardEl);
  }

  displayMessage(lines, onComplete) {
    if (this.isTransitioning) return false;
    this.isTransitioning = true;

    const newGrid = this._formatToGrid(lines);

    let pending = 0;

    const done = () => {
      this.isTransitioning = false;
      if (onComplete) onComplete();
    };

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const newChar = newGrid[r][c];
        const oldChar = this.currentGrid[r][c];

        if (newChar !== oldChar) {
          pending++;
          const delay = (r * this.cols + c) * STAGGER_DELAY;
          this.tiles[r][c].flipTo(newChar, delay, () => {
            pending--;
            if (pending === 0) done();
          });
        }
      }
    }

    if (pending === 0) done();

    this.currentGrid = newGrid;
    return true;
  }

  _formatToGrid(lines) {
    const grid = [];
    for (let r = 0; r < this.rows; r++) {
      const line = (lines[r] || '').toUpperCase();
      const padTotal = this.cols - line.length;
      const padLeft = Math.max(0, Math.floor(padTotal / 2));
      const padded = ' '.repeat(padLeft) + line + ' '.repeat(Math.max(0, this.cols - padLeft - line.length));
      grid.push(padded.split(''));
    }
    return grid;
  }
}

class MessageRotator {
  constructor(board) {
    this.board = board;
    this.messages = MESSAGES;
    this.currentIndex = -1;
    this._timer = null;
  }

  start() {
    this.next();
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.messages.length;
    if (this.board.displayMessage(this.messages[nextIndex], () => this._scheduleNext())) {
      this.currentIndex = nextIndex;
    }
  }

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.messages.length) % this.messages.length;
    if (this.board.displayMessage(this.messages[prevIndex], () => this._scheduleNext())) {
      this.currentIndex = prevIndex;
    }
  }

  _scheduleNext() {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.next(), MESSAGE_INTERVAL);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    const boardContainer = document.getElementById('board-container');
    if (!boardContainer) throw new Error('#board-container not found');

    const board = new Board(boardContainer);
    const rotator = new MessageRotator(board);

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
        case 'ArrowRight':
          e.preventDefault();
          rotator.next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          rotator.prev();
          break;
      }
    });

    rotator.start();
  } catch (e) {
    document.body.style.cssText = 'display:flex;align-items:center;justify-content:center;';
    document.body.textContent = 'OpenSolari failed to start: ' + e.message;
  }
});
