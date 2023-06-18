import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import DatabaseService from 'src/app/services/database.service';
import { Product } from 'src/app/classes/product';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent {
  productId: string;
  product: Product = new Product();
  isLoading: boolean = true;
  user: User | null = null;

  @ViewChild("successDialog") sucessDialog!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dbService: DatabaseService,
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {
    this.productId =
      this.activatedRoute.snapshot.paramMap.get('id') || 'undefined';
    this.dbService.getProductById(this.productId).subscribe((product) => {
      this.product = product;
      this.isLoading = false;
    });

    this.user = auth.getCurrentUser();
    auth.getCurrentUserAsObservable().subscribe(res => this.user = res)
  }

  async addToCart() {
    if (this.user !== null){
      this.cartService.addToCart(this.user.uid, this.productId, 1);
      this.sucessDialog.nativeElement.showModal();
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
