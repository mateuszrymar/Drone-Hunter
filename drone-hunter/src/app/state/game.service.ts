import { Injectable, WritableSignal, signal } from '@angular/core';
import { GameState } from '../model/game-state.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public stopGame$: WritableSignal<boolean>;
  public gameState$: WritableSignal<GameState>;
  public lastDrawStart: number;

  constructor() {
    this.stopGame$ = signal(false);
    this.gameState$ = signal(GameState.arwStopped);
    this.lastDrawStart = Date.now();
  }

  public saveDrawStart() {
    this.lastDrawStart = Date.now();
  }

  // @TODO: After the game is functional, rename aim and draw - it's confusing
  public aimBow = () => this.gameState$.set(GameState.bowAim);
  public drawBow = () => this.gameState$.set(GameState.bowDraw);
  public releaseArrow = () => this.gameState$.set(GameState.arwFlight);
  public stopArrow = () => this.gameState$.set(GameState.arwStopped);

  public stopGame() {
    this.stopGame$.set(true);

    setTimeout(() => {
      this.stopGame$.set(false);
    }, 100);
  }

}
