import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/classes/product';
import DatabaseService from 'src/app/services/database.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  @Input() products: Product[] = [];

  constructor() {}

  addToCart(prod: Product) : void {
    prod.inCart++;
  }

  // ngOnInit(): void {
  //   this.databaseService.getAllProducts().subscribe(
  //     (products) => (this.products = products));
  // }
}
