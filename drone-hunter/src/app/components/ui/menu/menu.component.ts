import { Component, WritableSignal } from '@angular/core';
import { SoundService } from '../../../state/sound.service';
import { ScreenService } from '../../../state/screen.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  public isOpen = false;
  public soundText$: WritableSignal<string>;

  constructor (
    public soundService: SoundService,
    public screenService: ScreenService
  ) {
    this.soundText$ = this.soundService.soundText$;
  }

  public toggle() {
    this.isOpen = !this.isOpen;
  }

  public close() {
    this.isOpen = false;
  }

  public endGame() {
    this.screenService.endGame();
    this.close();
  }
}
