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

  getNumberInCart(){
    let r = 0;
    this.products.forEach(prod => {
      r += prod.inCart;
    });
    return r;
  }

  getTotalPrice() {
    let r = 0;
    this.products.forEach(prod => {
      r += prod.price * prod.inCart;
    });
    return r.toFixed(2);
  }

  removeFromCart(){
    return true;
  }

}
