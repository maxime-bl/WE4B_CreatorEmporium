import { Component, Input } from '@angular/core';
import { Product } from 'src/app/classes/product';
import { User } from 'src/app/classes/user';
import DatabaseService from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent {
  currentUser: User | null = null;
  isSeller: boolean = false;

  @Input() products: Product[] = [];
  isLoading: boolean = true;

  constructor(private auth: AuthService, private dbService: DatabaseService) {
    this.currentUser = auth.getCurrentUser();
    this.getOwnProducts();
    this.auth.getCurrentUserAsObservable().subscribe(res => {
      this.currentUser = res;
      this.getOwnProducts();
    });
  }

  getOwnProducts() {
    if (this.currentUser?.isSeller) {
      this.isSeller = true;
      this.dbService.getProductByUserId(this.currentUser.uid).subscribe((products) => {
        this.products = products;
        this.isLoading = false
      })
    }
  }
}
