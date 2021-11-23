import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcStatementComponent } from './cc-statement.component';

describe('CcStatementComponent', () => {
  let component: CcStatementComponent;
  let fixture: ComponentFixture<CcStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
