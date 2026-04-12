import { Board } from './Board.js';
import { MessageRotator } from './MessageRotator.js';
import { KeyboardController } from './KeyboardController.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const boardContainer = document.getElementById('board-container');
    if (!boardContainer) throw new Error('#board-container not found');

    const board = new Board(boardContainer);
    const rotator = new MessageRotator(board);
    new KeyboardController(rotator);

    rotator.start();
  } catch (e) {
    document.body.style.cssText = 'display:flex;align-items:center;justify-content:center;';
    document.body.textContent = 'OpenSolari failed to start: ' + e.message;
  }
});
