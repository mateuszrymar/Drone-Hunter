import { Injectable } from '@angular/core';
import { Device } from '../model/device.enum';

@Injectable({
  providedIn: 'root'
})

export class DeviceService {
  public device: Device;

  constructor() {
    this.device = Device.unknown;
  }

  public setMouse() {
    if (this.device !== Device.unknown) return;

    console.log("device set: mouse");    
    this.device = Device.mouse;
  }

  public setTouch() {
    if (this.device !== Device.unknown) return;

    console.log("device set: touch");    
    this.device = Device.touch;
  }
}
