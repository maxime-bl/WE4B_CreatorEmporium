import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Product } from 'src/app/classes/product';
import { User } from 'src/app/classes/user';
import DatabaseService from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-edition-card',
  templateUrl: './product-edition-card.component.html',
  styleUrls: ['./product-edition-card.component.css']
})
export class ProductEditionCardComponent {
  @Input() product: Product = new Product();
  productID_res = '';

  currentUser: User | null = null;
  isSeller: boolean = false;

  isLoading: boolean = false;
  isQuantityValid: boolean = false;

  @ViewChild("successDialog") successDialog!: ElementRef;
  @ViewChild("errorDialog") errorDialog!: ElementRef;

  editForm = new FormGroup({
    quantity: new FormControl('', [Validators.required])
  })

  constructor(private auth: AuthService, private dbService: DatabaseService) {
    this.currentUser = auth.getCurrentUser();
    this.auth.getCurrentUserAsObservable().subscribe(res => {
      this.currentUser = res;
    });
  }

  update() {
    const value = this.editForm.get('quantity')?.value

    if (this.isFormValid()) {
      this.isLoading = true;
      this.dbService.updateProduct(this.product.productID, Number(value)).then((res: string) => {
        this.productID_res = res;
        this.successDialog.nativeElement.showModal();
        this.isLoading = false;
      }).catch((error) => {
        console.log(error);
        this.errorDialog.nativeElement.showModal();
        this.isLoading = false;
      });
    }
  }

  remove() {
    this.isLoading = true;
    this.dbService.removeProduct(this.product.productID).catch((error) => {
      console.log(error);
      this.errorDialog.nativeElement.showModal();
      this.isLoading = false;
    })
    this.isLoading = false;
  }

  onQuantityChanged() {
    const value = this.editForm.get('quantity')?.value

    if (Number.isInteger(value) && Number(value) >= 0) {
      this.isQuantityValid = true
    } else {
      this.isQuantityValid = false
    }
  }

  isTouched(inputName: string): boolean {
    const input = this.editForm.get(inputName)!;
    return input.touched;
  }

  isFormValid(): boolean {
    return this.editForm.valid && this.isQuantityValid
  }
}
