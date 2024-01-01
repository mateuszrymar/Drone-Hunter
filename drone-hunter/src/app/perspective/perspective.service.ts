import { Injectable, Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ScreenDimensions } from '../model/screen-dimensions.interface'

@Injectable({
  providedIn: 'root'
})
export class PerspectiveService implements AfterViewInit {

  // @ViewChild('game-container') gameContainer!: ElementRef;

  public gameContainerWidth!: number;
  public gameContainerHeight!: number;
  public screen!: ScreenDimensions;
  public fov = 39.6;
  public cameraHeight = 1.7;
  public imagePlaneDepth = 0.2;
  public imagePlane!: ScreenDimensions;
  public imagePlaneScale!: number;
  public perspective = {
    name: 'perspective',
  }

  private gameContainer = document.getElementById('game-container');

  constructor() { }

  ngAfterViewInit() {
    
    this.gameContainerWidth = this.gameContainer!.offsetWidth;
    this.gameContainerHeight = this.gameContainer!.offsetHeight;
    console.log(this.gameContainerWidth);
    
    this.screen = {
      name: 'screen',
      width: this.gameContainerWidth,
      height: this.gameContainerHeight,
      depth: 0,
    }
    this.imagePlane = {
      name: 'imagePlane',
      width: 2 * this.imagePlaneDepth * Math.tan((this.fov / 2) * (Math.PI) / 180),
      height: (2 * this.imagePlaneDepth * Math.tan((this.fov / 2 * Math.PI / 180))) * (this.gameContainerWidth / this.gameContainerHeight),
      depth: this.imagePlaneDepth,
    }
    this.imagePlaneScale = this.imagePlane.width / this.gameContainerWidth;
  }

  public saveViewContainerWidth() {
    // @TODO: save sizes of DOM elements correctly.
  }
}
