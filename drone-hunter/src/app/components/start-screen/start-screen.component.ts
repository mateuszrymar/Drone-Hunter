import { Component } from '@angular/core';
import { DeviceService } from '../../state/device.service';
import { ScreenService } from '../../state/screen.service';
import { ScreenState } from '../../model/screen-state.enum';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.css'
})
export class StartScreenComponent {

  public startScreenName = ScreenState.start;
  public tutorialScreenName = ScreenState.tutorial;

  private isTutorialSkipped = false;

  constructor(
    public deviceService: DeviceService,
    public screenService: ScreenService) { }

  public runTutorial() {
    this.screenService.runTutorial();
    // startBtn.style.display = 'none';
    // titleScreen.style.display = 'none';
    // burgerMenuOn();

    // tutorial.style.display = 'block';
    // if (device === 'mouse') {
    //   tutorial.addEventListener('mouseup', skipTutorial);
    // } else {
    //   tutorial.addEventListener('touchend', skipTutorial);
    // }
    
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
