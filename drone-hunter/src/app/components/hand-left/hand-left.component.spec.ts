import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandLeftComponent } from './hand-left.component';

describe('HandLeftComponent', () => {
  let component: HandLeftComponent;
  let fixture: ComponentFixture<HandLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandLeftComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
