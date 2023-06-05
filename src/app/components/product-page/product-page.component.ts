import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Product } from 'src/app/classes/product';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent implements OnInit {
  productId: string;
  product: Product = new Product();

  constructor(
    private activatedRoute: ActivatedRoute,
    private dbService: DatabaseService
  ) {
    this.productId =
      this.activatedRoute.snapshot.paramMap.get('id') || 'undefined';
  }

  ngOnInit(): void {
    this.dbService
      .getProductById(this.productId)
      .then((product) => (this.product = product));
  }
}
