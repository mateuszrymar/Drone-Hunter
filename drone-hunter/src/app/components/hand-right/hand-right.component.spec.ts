import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandRightComponent } from './hand-right.component';

describe('HandRightComponent', () => {
  let component: HandRightComponent;
  let fixture: ComponentFixture<HandRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandRightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
