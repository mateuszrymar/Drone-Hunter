import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialScreenComponent } from './tutorial-screen.component';

describe('TutorialScreenComponent', () => {
  let component: TutorialScreenComponent;
  let fixture: ComponentFixture<TutorialScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TutorialScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
