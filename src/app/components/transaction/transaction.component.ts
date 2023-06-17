import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from 'src/app/classes/transaction';
import DatabaseService from 'src/app/services/database.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {
  @Input() transaction: Transaction = new Transaction();

  constructor(){}

}
