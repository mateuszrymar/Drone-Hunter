import { Component } from '@angular/core';
import { ScreenService } from '../../../state/screen.service';
import { ScreenState } from '../../../model/screen-state.enum';

@Component({
  selector: 'app-game-screen',
  standalone: true,
  imports: [],
  templateUrl: './game-screen.component.html',
  styleUrl: './game-screen.component.css'
})
export class GameScreenComponent {

  public gameStateName = ScreenState.game;

  constructor(public screenService: ScreenService) { }
}
