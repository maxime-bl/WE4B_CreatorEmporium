import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CartItem } from 'src/app/classes/cart-item';
import { Product } from 'src/app/classes/product';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import DatabaseService from 'src/app/services/database.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cartItems: CartItem[] = [];
  productMap = new Map<string, Product>();
  user: User | null = null;

  constructor(
    private auth: AuthService,
    private cartService: CartService,
    private dbService: DatabaseService,
    private router: Router
  ) {
    this.checkUser(auth.getCurrentUser());
    auth.getCurrentUserAsObservable().subscribe((res) => this.checkUser(res));
  }

  checkUser(user: User | null) {
    this.user = user;

    if (this.user === null) {
      this.router.navigateByUrl('/login');
    } else if (this.user.isSeller) {
      this.router.navigateByUrl('/');
    } else {
      this.fetchProductsInCart();
    }
  }

  async fetchProductsInCart() {
    this.cartService.getCartItems(this.user!.uid).subscribe((res) => {
      this.productMap.clear();
      this.cartItems = res;

      res.forEach(async (item: CartItem) => {
        this.productMap.set(
          item.productID,
          await firstValueFrom(this.dbService.getProductById(item.productID))
        );
      });
    });
  }

  removeItem(item: CartItem) {
    this.cartService
      .removeFromCart(this.user!.uid, item.productID)
      .then(() => this.fetchProductsInCart());
  }

  getTotalPrice() {
    try {
      return this.cartItems.reduce(
        (total, item) =>
          total + this.productMap.get(item.productID)!.price * item.quantity,
        0
      );
    } catch (error) {
      return 0;
    }
  }

  async purchase() {
    this.cartService
      .purchaseCart(this.user!, this.cartItems)
      .then(() => {
        this.fetchProductsInCart();
      })
      .catch((error) => console.log(error));
  }
}
