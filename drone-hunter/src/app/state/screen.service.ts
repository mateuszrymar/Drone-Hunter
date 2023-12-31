import { Injectable, signal, Signal } from '@angular/core';
import { ScreenState } from '../model/screen-state.enum';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  public ScreenState: Signal<ScreenState>;

  constructor() {
    this.ScreenState = signal(ScreenState.start);
  }

  public runTutorial() {
    console.log("Tutorial started");    
    this.ScreenState = signal(ScreenState.tutorial);
  }
  
  public runGame() {
    console.log("Game started");    
    this.ScreenState = signal(ScreenState.game);
  }
  
  public endGame() {
    console.log("Game ended");
    this.ScreenState = signal(ScreenState.end);
  }

}
