import { Component, OnInit, Input } from '@angular/core';
import DatabaseService from 'src/app/services/database.service';
import { Product } from 'src/app/classes/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  dbService: DatabaseService;
  products: Product[] = [];
  
  constructor(dbService: DatabaseService) {
    this.dbService = dbService
    
    dbService.getAllProducts().subscribe((res: Product[]) => {
      this.products = res;
    });
  }

  getTotalPrice() {
    let r = 0;
    this.products.forEach(prod => {
      r += prod.price;
    });
    return r.toFixed(2);
  }

  deleteFromCart(){
    
  }

}
