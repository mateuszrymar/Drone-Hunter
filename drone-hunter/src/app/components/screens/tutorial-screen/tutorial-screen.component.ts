import { Component } from '@angular/core';
import { ScreenService } from '../../../state/screen.service';

@Component({
  selector: 'app-tutorial-screen',
  standalone: true,
  imports: [],
  templateUrl: './tutorial-screen.component.html',
  styleUrl: './tutorial-screen.component.css'
})
export class TutorialScreenComponent {

  private isTutorialSkipped = false;

  constructor(public screenService: ScreenService) {

  }

  ngOnInit() {
    setTimeout(() => {
      if (this.isTutorialSkipped === false) {
        this.skipTutorial();
      }
    }, 5600);

  }

  public skipTutorial() {
    this.isTutorialSkipped = true;
    this.screenService.runGame();
  }

}
