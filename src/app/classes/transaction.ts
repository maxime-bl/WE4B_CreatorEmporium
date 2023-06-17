import { Timestamp } from "@angular/fire/firestore";

export class Transaction {
    constructor(
        public date: Timestamp = Timestamp.now(),
        public productID: string = '',
        public productName: string = '',
        public quantity: Number = 0,
        public sellerID: string = '',
        public sellerName: string = '',
        public userID: string = '',
        public username: string = '',
        public totalPrice: Number = 0,
    ) { }
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
