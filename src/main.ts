import 'zone.js';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { interval, take } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Hello from {{ name }}!</h1>
    <div class="grid-container">
      <div *ngFor="let d of dimention"  class="item" [ngClass]="{'live-cell': d}">

      </div>
    </div>
    <a target="_blank" href="https://angular.dev/overview">
      Learn more about Angular
    </a>
  `,
})
export class App {
  initialLiveCells = [
    2, 4, 7, 11, 13, 22, 24, 31, 34, 42, 47, 53, 56, 62, 66, 71, 77, 81, 88, 99,
  ];
  dimention = new Array(100).fill(0);

  name = 'Digdhi Chavda';

  /** used take(25) so that it does not go in infine loop */
  updateCells$ = interval(1000)
    .pipe(take(25))
    .subscribe(() => {
      if (this.dimention.some((cell) => cell)) {
        this.dimention = this.checkAndUpdateCell();
      }
    });

  ngOnInit() {
    this.initialLiveCells.forEach((cell) => (this.dimention[cell] = 1));
    this.dimention = this.checkAndUpdateCell();
  }

  checkAndUpdateCell() {
    const updatedGrid = new Array(100).fill(0);
    for (let i = 0; i < 100; i++) {
      const neighborCellCount = this.getLiveNeighborCellCount(i);
      const isCurrentCellLive = this.dimention[i];
      if (
        isCurrentCellLive &&
        (neighborCellCount === 2 || neighborCellCount === 3)
      ) {
        updatedGrid[i] = 1;
      } else if (!isCurrentCellLive && neighborCellCount === 3) {
        updatedGrid[i] = 1;
      } else {
        updatedGrid[i] = 0;
      }
    }
    console.log(updatedGrid);
    return updatedGrid;
  }
  getLiveNeighborCellCount(index: number) {
    let neighborLiveCell = 0;
    const gridDimentions = 10;
    for (let i = -1; i < 2; i++) {
      if (this.dimention[index + i]) neighborLiveCell++;
      if (this.dimention[index - gridDimentions + i]) neighborLiveCell++;
      if (this.dimention[index + gridDimentions + i]) neighborLiveCell++;
    }
    return neighborLiveCell;
  }

  ngOnDestroy() {
    this.updateCells$.unsubscribe();
  }
}

bootstrapApplication(App);
