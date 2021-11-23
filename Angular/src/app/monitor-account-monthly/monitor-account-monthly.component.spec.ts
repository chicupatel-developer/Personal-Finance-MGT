import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorAccountMonthlyComponent } from './monitor-account-monthly.component';

describe('MonitorAccountMonthlyComponent', () => {
  let component: MonitorAccountMonthlyComponent;
  let fixture: ComponentFixture<MonitorAccountMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorAccountMonthlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorAccountMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
