import { Component } from '@angular/core';
import { DeviceService } from '../../state/device.service';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.css'
})
export class StartScreenComponent {

  constructor(public deviceService: DeviceService) { }

  public startTutorial() {
    // startBtn.style.display = 'none';
    // titleScreen.style.display = 'none';
    // burgerMenuOn();

    // tutorial.style.display = 'block';
    // if (device === 'mouse') {
    //   tutorial.addEventListener('mouseup', skipTutorial);
    // } else {
    //   tutorial.addEventListener('touchend', skipTutorial);
    // }
    
    // setTimeout(() => {
    //   if (tutorialSkipped === false) {
    //     skipTutorial();
    //   }
    // }, "5380");
  }
}
