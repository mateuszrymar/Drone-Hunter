import { Component, WritableSignal, signal, OnInit } from '@angular/core';
import { SoundService } from '../../state/sound.service';
import { ScreenService } from '../../state/screen.service';
import { ScreenState } from '../../model/screen-state.enum';
import { MenuComponent } from "./menu/menu.component";

@Component({
    selector: 'app-ui',
    standalone: true,
    templateUrl: './ui.component.html',
    styleUrl: './ui.component.css',
    imports: [MenuComponent]
})
export class UiComponent {

  public toggleText$: WritableSignal<string>;
  public start = ScreenState.start;
  public game = ScreenState.game;

  constructor(
    public soundService: SoundService,
    public screenService: ScreenService) 
  {
    this.toggleText$ = this.soundService.soundText$;
  }  

}
