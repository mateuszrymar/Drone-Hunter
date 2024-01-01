import { Component, ElementRef, AfterViewInit, HostBinding, ViewChild, OnChanges, OnInit, WritableSignal, Signal, computed, Input } from '@angular/core';
import { GameService } from '../../state/game.service';
import { GameState } from '../../model/game-state.enum';
import { Point2D } from '../../model/geometry';
import { GraphicsService } from '../../graphics/graphics.service';

@Component({
  selector: 'app-hand-left',
  standalone: true,
  imports: [],
  templateUrl: './hand-left.component.html',
  styleUrl: './hand-left.component.css'
})
export class HandLeftComponent implements AfterViewInit {

  @Input() position: Point2D = {x:0, y:0};
  public top!: string;
  public left!: string;


  public isVisible$: Signal<boolean> = computed(
    () => this.gameService.gameState$() === GameState.bowAim 
       || this.gameService.gameState$() === GameState.bowDraw);
  private widthPx!: number;

  constructor(
    public gameService: GameService,
    private element: ElementRef,
    private graphicsService: GraphicsService) { }

  ngAfterViewInit(): void {
    this.setWidthPx();
    this.graphicsService.saveLeftHandSize(this.widthPx);
  }

  ngOnChanges() {
    console.log("changes");
    console.log(this.position);
    this.left = `${this.position.x-this.widthPx/2}px`;
    this.top = `${this.position.y-this.widthPx/2}px`;
  }



  public toCss(coordinate: number) {
    console.log(`${coordinate}px`);
    
    return `${coordinate}px`
  }

  private setWidthPx() {
    this.widthPx = this.element.nativeElement.offsetWidth;
  }
}
