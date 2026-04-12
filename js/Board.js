import { Tile } from './Tile.js';
import { GRID_COLS, GRID_ROWS, STAGGER_DELAY } from './constants.js';

export class Board {
  constructor(containerEl, soundEngine) {
    this.cols = GRID_COLS;
    this.rows = GRID_ROWS;
    this.soundEngine = soundEngine;
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

    if (pending > 0 && this.soundEngine) {
      this.soundEngine.playTransition();
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
