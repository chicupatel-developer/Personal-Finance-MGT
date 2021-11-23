import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardPayeeReportComponent } from './credit-card-payee-report.component';

describe('CreditCardPayeeReportComponent', () => {
  let component: CreditCardPayeeReportComponent;
  let fixture: ComponentFixture<CreditCardPayeeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardPayeeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardPayeeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
