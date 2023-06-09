import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/classes/product';
import DatabaseService from 'src/app/services/database.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.databaseService.getAllProducts().subscribe(
      (products) => (this.products = products));
  }
}
