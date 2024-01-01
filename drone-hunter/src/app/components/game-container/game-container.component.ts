import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { GameScreenComponent } from "../screens/game-screen/game-screen.component";
import { StartScreenComponent } from "../screens/start-screen/start-screen.component";
import { UiComponent } from "../ui/ui.component";
import { EndScreenComponent } from "../screens/end-screen/end-screen.component";
import { ScreenService } from '../../state/screen.service';
import { ScreenState } from '../../model/screen-state.enum';
import { TutorialScreenComponent } from "../screens/tutorial-screen/tutorial-screen.component";
import { PerspectiveService } from '../../perspective/perspective.service';

@Component({
    selector: 'app-game-container',
    standalone: true,
    templateUrl: './game-container.component.html',
    styleUrl: './game-container.component.css',
    imports: [GameScreenComponent, StartScreenComponent, UiComponent, EndScreenComponent, TutorialScreenComponent]
})
export class GameContainerComponent {

    public startScreen = ScreenState.start;
    public tutorialScreen = ScreenState.tutorial;
    public gameScreen = ScreenState.game;
    public endScreen = ScreenState.end;

    constructor(
        public screenService: ScreenService,
        private perspectiveService: PerspectiveService,
        private element: ElementRef) { }

    ngAfterViewInit() {
        let gameContainer = document.getElementById('game-container');

        console.log("setting size", gameContainer!.offsetWidth);
        this.perspectiveService.gameContainerWidth = gameContainer!.offsetWidth;
        this.perspectiveService.gameContainerHeight = gameContainer!.offsetHeight;
    }
}
