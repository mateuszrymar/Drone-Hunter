import { Component, AfterViewInit } from '@angular/core';
import { ScreenService } from '../../../state/screen.service';
import { GameService } from '../../../state/game.service';
import { ScreenState } from '../../../model/screen-state.enum';
import { HandLeftComponent } from "../../hand-left/hand-left.component";
import { HandRightComponent } from "../../hand-right/hand-right.component";
import { GameState } from '../../../model/game-state.enum';
import { PerspectiveService } from '../../../perspective/perspective.service';
import { Point2D } from '../../../model/geometry';


@Component({
    selector: 'app-game-screen',
    standalone: true,
    templateUrl: './game-screen.component.html',
    styleUrl: './game-screen.component.css',
    imports: [HandLeftComponent, HandRightComponent]
})
export class GameScreenComponent {

  public gameStateName = ScreenState.game;
  public leftHandPosition!: Point2D;
  private gameContainerWidth = this.perspectiveService.gameContainerWidth;
  private gameContainerHeight = this.perspectiveService.gameContainerHeight;

  constructor(
    public screenService: ScreenService,
    public gameService: GameService,
    public perspectiveService: PerspectiveService
  ) { }

  ngAfterViewInit() {
    this.gameContainerWidth = this.perspectiveService.gameContainerWidth;
    console.log("width: ", this.gameContainerWidth);    
    this.gameContainerHeight = this.perspectiveService.gameContainerHeight;
    console.log("height: ", this.gameContainerHeight);    

  }

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

    this.leftHandPosition = {x: 0, y: 0};

    if (e instanceof MouseEvent) {
      this.leftHandPosition.x = e.clientX - ((window.innerWidth - (this.gameContainerWidth * 0.45)) / 2 );
      // this.leftHandPosition.x = e.clientX;
      this.leftHandPosition.y = e.clientY;
    } else if (e instanceof TouchEvent) {
      this.leftHandPosition.x = e.touches[0].clientX;
      this.leftHandPosition.y = e.touches[0].clientY;
    } else throw new Error("Unsupported device!");


  }
}
