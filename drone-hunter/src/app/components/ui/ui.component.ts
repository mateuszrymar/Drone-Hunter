import { Component } from '@angular/core';
import { SoundService } from '../../state/sound.service';

@Component({
  selector: 'app-ui',
  standalone: true,
  imports: [],
  templateUrl: './ui.component.html',
  styleUrl: './ui.component.css'
})
export class UiComponent {

  constructor(public soundService: SoundService) {

  }

}
