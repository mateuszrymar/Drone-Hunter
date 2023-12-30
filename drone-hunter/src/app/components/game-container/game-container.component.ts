import { Component } from '@angular/core';
import { GameScreenComponent } from "../game-screen/game-screen.component";
import { StartScreenComponent } from "../start-screen/start-screen.component";
import { UiComponent } from "../ui/ui.component";
import { EndScreenComponent } from "../end-screen/end-screen.component";

@Component({
    selector: 'app-game-container',
    standalone: true,
    templateUrl: './game-container.component.html',
    styleUrl: './game-container.component.css',
    imports: [GameScreenComponent, StartScreenComponent, UiComponent, EndScreenComponent]
})
export class GameContainerComponent {

}
