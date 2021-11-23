import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardTransactionComponent } from './credit-card-transaction.component';

describe('CreditCardTransactionComponent', () => {
  let component: CreditCardTransactionComponent;
  let fixture: ComponentFixture<CreditCardTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
