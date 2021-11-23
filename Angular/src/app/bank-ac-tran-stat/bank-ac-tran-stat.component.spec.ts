import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAcTranStatComponent } from './bank-ac-tran-stat.component';

describe('BankAcTranStatComponent', () => {
  let component: BankAcTranStatComponent;
  let fixture: ComponentFixture<BankAcTranStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAcTranStatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAcTranStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
