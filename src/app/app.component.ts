import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  currentPlayer = 'x';
  endGame = false;
  winner!: string;
  playersSelection: playersSelection = { x: [], o: [] };
  winingOptions = [
    ['00', '01', '02'],
    ['00', '10', '20'],
    ['10', '11', '12'],
    ['01', '11', '21'],
    ['20', '21', '22'],
    ['02', '12', '22'],
    ['20', '11', '02'],
    ['00', '11', '22'],
  ];

  constructor(private elem: ElementRef) {}

  setValue(event: Event, col: number, row: number): void {
    this.setButtonMark(event);
    this.playersSelection[this.currentPlayer as keyof playersSelection].push(
      `${row}${col}`
    );
    this.checkWinningOptions(this.currentPlayer);
  }

  setButtonMark(event: Event) {
    let element = event.target as HTMLButtonElement;
    element.autocapitalize;
    element.textContent = this.currentPlayer;
    element.disabled = true;
  }

  checkWinningOptions(player: string) {
    if (this.playersSelection[player as keyof playersSelection].length < 3) {
      this.setNextPlayer();
      return;
    }

    this.winingOptions.forEach((option) => {
      if (this.checkPlayerScore(player, option)) {
        this.gameEnd(this.currentPlayer);
        return;
      }
    });

    if (
      this.playersSelection.x.concat(this.playersSelection.o).length >= 9 &&
      !this.endGame
    ) {
      this.gameEnd('drow');
      return;
    }

    this.setNextPlayer();
  }

  checkPlayerScore(player: string, option: string[]): boolean {
    return (
      this.playersSelection[player as keyof playersSelection].filter((val) => {
        return option.indexOf(val) > -1;
      }).length == option.length
    );
  }

  setNextPlayer() {
    if (this.endGame) {
      return;
    }
    this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
  }

  newGame(): void {
    this.playersSelection = { x: [], o: [] };
    let elements = this.elem.nativeElement.querySelectorAll('.tik_button');
    elements.forEach((element: HTMLButtonElement) => {
      element.innerHTML = '&nbsp;';
      element.disabled = false;
    });
    this.winner = '';
    this.currentPlayer = 'x';
    this.endGame = false;
  }

  gameEnd(winnerName: string): void {
    this.endGame = true;
    this.winner = winnerName;
  }
}

export interface playersSelection {
  x: string[];
  o: string[];
}
