import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndScreenComponent } from './end-screen.component';

describe('EndScreenComponent', () => {
  let component: EndScreenComponent;
  let fixture: ComponentFixture<EndScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EndScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
