import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hand-left',
  standalone: true,
  imports: [],
  templateUrl: './hand-left.component.html',
  styleUrl: './hand-left.component.css'
})
export class HandLeftComponent implements AfterViewInit {

  @ViewChild('left-hand') component!: ElementRef;

  private widthPx!: number

  public aimLeftHand() {
    console.log('aiming left hand');    
  }

  ngAfterViewInit(): void {
    this.widthPx = this.component.nativeElement.offsetWidth;
  }
}
