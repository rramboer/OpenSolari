import { Board } from './Board.js';
import { SoundEngine } from './SoundEngine.js';
import { MessageRotator } from './MessageRotator.js';
import { KeyboardController } from './KeyboardController.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const boardContainer = document.getElementById('board-container');
    if (!boardContainer) throw new Error('#board-container not found');

    const soundEngine = new SoundEngine();
    soundEngine.muted = true;
    const board = new Board(boardContainer, soundEngine);
    const rotator = new MessageRotator(board);
    new KeyboardController(rotator, soundEngine);

    rotator.start();
  } catch (e) {
    document.body.style.cssText = 'display:flex;align-items:center;justify-content:center;';
    document.body.textContent = 'FlipOff failed to start: ' + e.message;
  }
});
