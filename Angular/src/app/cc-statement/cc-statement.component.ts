import { Component, Input, OnInit, OnChanges } from '@angular/core';
import CreditCardStatement from '../models/creditCardStatement';

@Component({
  selector: 'app-cc-statement',
  templateUrl: './cc-statement.component.html',
  styleUrls: ['./cc-statement.component.css']
})
export class CcStatementComponent implements OnChanges {

  @Input() ccStatement = new CreditCardStatement();


  constructor() { }

  ngOnChanges() {
    
  }

}
