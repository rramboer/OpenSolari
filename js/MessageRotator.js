import { MESSAGES, MESSAGE_INTERVAL } from './constants.js';

export class MessageRotator {
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
