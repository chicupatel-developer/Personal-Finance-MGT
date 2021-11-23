import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceBankTransactionComponent } from './source-bank-transaction.component';

describe('SourceBankTransactionComponent', () => {
  let component: SourceBankTransactionComponent;
  let fixture: ComponentFixture<SourceBankTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceBankTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceBankTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
