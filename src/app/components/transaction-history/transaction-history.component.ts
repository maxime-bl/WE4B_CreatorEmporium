import { Component, Input } from '@angular/core';
import { Transaction } from 'src/app/classes/transaction';
import { User } from 'src/app/classes/user';
import DatabaseService from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent {
  currentUser: User | null = null;
  isSeller: boolean = false;

  transactions: Transaction[] = [];
  isLoading: boolean = true;

  constructor(private auth: AuthService, private dbService: DatabaseService) {
    this.auth.getCurrentUserAsObservable().subscribe(
      res => {
        this.currentUser = res;
      }
    )
    if (this.currentUser?.isSeller) {
      this.isSeller = true;
      this.dbService.getTransactionBySellerID(this.currentUser.uid).subscribe((transactions) => {
        this.transactions = transactions;
        this.isLoading = false;
      })
    } else if (this.currentUser){
      this.isSeller = false;
      this.dbService.getTransactionByUserID(this.currentUser.uid).subscribe((transactions) => {
        this.transactions = transactions;
        this.isLoading = false;
      })
    }
  }
}
