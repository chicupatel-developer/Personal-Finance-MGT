import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProjectCodingLengthComponent } from './all-project-coding-length.component';

describe('AllProjectCodingLengthComponent', () => {
  let component: AllProjectCodingLengthComponent;
  let fixture: ComponentFixture<AllProjectCodingLengthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllProjectCodingLengthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllProjectCodingLengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
