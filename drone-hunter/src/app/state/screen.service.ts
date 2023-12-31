import { Injectable, signal, WritableSignal } from '@angular/core';
import { ScreenState } from '../model/screen-state.enum';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  public ScreenState$: WritableSignal<ScreenState> = signal(ScreenState.start);

  constructor() { }

  public runTutorial() {
    console.log("Tutorial started");    
    this.ScreenState$.set(ScreenState.tutorial);
  }
  
  public runGame() {
    console.log("Game started");    
    this.ScreenState$.set(ScreenState.game);
  }
  
  public endGame() {
    console.log("Game ended");
    this.ScreenState$.set(ScreenState.end);
  }

}
