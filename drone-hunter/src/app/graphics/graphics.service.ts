import { ElementRef, Injectable } from '@angular/core';
import { PerspectiveService } from '../perspective/perspective.service';

@Injectable({
  providedIn: 'root'
})
export class GraphicsService {
  public totalScore = 0;
  public arrowId = 0;
  public targetSize = 1*1.22;
  // public targetSizePixels;
  public targetPosition = {u: 0, v:(1.5-this.perspectiveService.cameraHeight), w:30};
  // public targetPositionPixels;
  public arrowSize = 150;
  // public leftHandPosition;
  public leftHandSize = 0;

  constructor(
    private perspectiveService: PerspectiveService,
  ) { }

  public saveLeftHandSize(size: number) {
    this.leftHandSize = size;
  }
}
