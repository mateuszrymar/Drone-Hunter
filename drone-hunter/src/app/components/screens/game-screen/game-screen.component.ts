import { Component } from '@angular/core';
import { ScreenService } from '../../../state/screen.service';
import { GameService } from '../../../state/game.service';
import { ScreenState } from '../../../model/screen-state.enum';
import { HandLeftComponent } from "../../hand-left/hand-left.component";
import { HandRightComponent } from "../../hand-right/hand-right.component";
import { GameState } from '../../../model/game-state.enum';
import { PerspectiveService } from '../../../perspective/perspective.service';


@Component({
    selector: 'app-game-screen',
    standalone: true,
    templateUrl: './game-screen.component.html',
    styleUrl: './game-screen.component.css',
    imports: [HandLeftComponent, HandRightComponent]
})
export class GameScreenComponent {

  public gameStateName = ScreenState.game;
  public aim = GameState.bowAim;
  public draw = GameState.bowDraw;
  private gameContainerHeight = this.perspectiveService.gameContainerHeight;

  constructor(
    public screenService: ScreenService,
    public gameService: GameService,
    public perspectiveService: PerspectiveService
  ) { }

  public gameStarted(e: Event) {
    this.gameService.aimBow();
    if(this.gameService.stopGame$() === true) return;

    this.aimLeftHand(e);
    this.gameService.saveDrawStart();
  }

  public bowAimed() {
    if (this.gameService.gameState$() !== GameState.bowAim) return;
    this.gameService.drawBow();
  }

  public bowReleased() {
    this.gameService.releaseArrow();
  }

  private aimLeftHand(e: Event) {
    let triggerX;
    let triggerY;
    if (e instanceof MouseEvent) {
      triggerX = e.clientX - ((window.innerWidth - (this.gameContainerHeight * 0.45)) / 2 );
      triggerY = e.clientY;
    } else if (e instanceof TouchEvent) {
      triggerX = e.touches[0].clientX;
      triggerY = e.touches[0].clientY;
    } else throw new Error("Unsupported device!");


  }
}
