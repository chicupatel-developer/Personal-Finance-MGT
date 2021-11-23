import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeAddComponent } from './payee-add.component';

describe('PayeeAddComponent', () => {
  let component: PayeeAddComponent;
  let fixture: ComponentFixture<PayeeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayeeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
