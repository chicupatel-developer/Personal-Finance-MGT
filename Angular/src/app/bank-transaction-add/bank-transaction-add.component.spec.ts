import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTransactionAddComponent } from './bank-transaction-add.component';

describe('BankTransactionAddComponent', () => {
  let component: BankTransactionAddComponent;
  let fixture: ComponentFixture<BankTransactionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankTransactionAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankTransactionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
