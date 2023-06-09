import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import DatabaseService from 'src/app/services/database.service';
import { Product } from 'src/app/classes/product';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent {
  productId: string;
  product: Product = new Product();
  isLoading: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dbService: DatabaseService
  ) {
    this.productId =
      this.activatedRoute.snapshot.paramMap.get('id') || 'undefined';
    this.dbService.getProductById(this.productId).subscribe((product) => {
      this.product = product;
      this.isLoading = false;
    });
  }

  // ngOnInit(): void {
  //   this.dbService.getProductById(this.productId).subscribe((product) => {
  //     this.product = product;
  //     
  //   });
  // }
}
