import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountStatementAllComponent } from './account-statement-all.component';

describe('AccountStatementAllComponent', () => {
  let component: AccountStatementAllComponent;
  let fixture: ComponentFixture<AccountStatementAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountStatementAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountStatementAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
