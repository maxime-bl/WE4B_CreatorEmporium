import { Timestamp } from "@angular/fire/firestore";

export class Transaction {
    constructor(
        date: Timestamp = Timestamp.now(),
        productID: string = '',
        productName: string = '',
        quantity: Number = 0,
        sellerID: string = '',
        sellerName: string = '',
        userID: string = '',
        username: string = '',
        totalPrice: Number = 0,     
    ){}
}

export interface TransactionData {
    date: Timestamp,
        productID: string;
        productName: string;
        quantity: Number;
        sellerID: string;
        sellerName: string;
        userID: string;
        username: string;
        totalPrice: Number;
  }
  