import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPayeeReportComponent } from './account-payee-report.component';

describe('AccountPayeeReportComponent', () => {
  let component: AccountPayeeReportComponent;
  let fixture: ComponentFixture<AccountPayeeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPayeeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPayeeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
