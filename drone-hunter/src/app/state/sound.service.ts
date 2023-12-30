import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SoundService {

  public soundtrack: HTMLAudioElement;
  public soundText: string;
  
  private _isSoundOn$: WritableSignal<boolean>;
  private _soundTexts = ["sound off", "sound on"];
  private _soundtrackFile = new Audio('assets/sounds/music.mp3');
  private _soundtrackVolume = 0.4;

  constructor() {
    this.soundtrack = this._soundtrackFile;
    this.soundtrack.loop = true;
    this.soundtrack.volume = this._soundtrackVolume;

    this._isSoundOn$ = signal(false);
    this.soundText = this._soundTexts[Number(this._isSoundOn$)];
   }

  public toggleSound() {
    this._isSoundOn$.set(!this._isSoundOn$());
    this.soundText = this._soundTexts[Number(this._isSoundOn$())];

    if (this._isSoundOn$()) {
      this.soundOn();
    } else {
      this.soundOff();
    }
  }

  private soundOn () {
    this.soundtrack.play();
  }
  
  private soundOff () {
    this.soundtrack.pause();
  }


}
