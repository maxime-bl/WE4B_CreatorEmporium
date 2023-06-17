import { Component, ElementRef, ViewChild } from '@angular/core';
import { Data } from '@angular/router';
import DatabaseService from 'src/app/services/database.service';
import { Category } from 'src/app/classes/category';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {

  categoryList: Category[] = []
  image: File | null = null;
  productID = '';
  isLoading = false;
  
  isImageValid = false;
  isPriceValid = false;
  isQuantityValid = false;

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    imgFile: new FormControl(''),
    category: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required])
  })

  @ViewChild("successDialog") sucessDialog!: ElementRef;
  @ViewChild("errorDialog") errorDialog!: ElementRef;

  constructor(private dbService: DatabaseService, private storageService: StorageService, private auth: AuthService){
    this.dbService.getCategories().subscribe((res) => {
      this.categoryList = res;
    })   
  }


  async submit() {
    if (this.isFormValid()){
      this.isLoading=true;

      const name = this.productForm.get("name")?.value;
      const description = this.productForm.get("description")?.value;
      const price = Number(this.productForm.get("price")?.value);
      const quantity = Number(this.productForm.get("quantity")?.value);
      const categoryID = this.productForm.get("category")?.value;
      const seller = this.auth.getCurrentUser()?.displayName;

      this.dbService.addProduct(name!, description!, price!, quantity!, categoryID!, this.image!, seller!).then((res: string)=> {
        this.productID = res;
        this.sucessDialog.nativeElement.showModal();
        this.isLoading = false;
      }).catch((error) => {
        console.log(error);
        this.errorDialog.nativeElement.showModal();
        this.isLoading = false;
      })
    }
  }

  onFileSelected(event: any) { 
    const file = event.target.files[0];
    this.isImageValid = this.productForm.get('imgFile')?.value != '' && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
    if (this.isImageValid){
      this.image = file;
    }
  }

  onQuantityChanged(){
    const value = this.productForm.get('quantity')?.value

    if (Number.isInteger(value) && Number(value) >= 0) {
      this.isQuantityValid = true
    } else {
      this.isQuantityValid = false
    }
  }

  onPriceChanged(){
    const value = this.productForm.get('price')?.value

    if (value !== '' && !Number.isNaN(value) && Number(value) >= 0) {
      this.isPriceValid = true
    } else {
      this.isPriceValid = false
    }
  }

  isFormValid() : boolean {
    return this.productForm.valid && this.isImageValid && this.isPriceValid && this.isQuantityValid
  }

  isInputValid(inputName : string): boolean {
    const input = this.productForm.get(inputName)!;
    if (input.touched && input.errors) {
      return false;
    } else {
      return true;
    }
  }

  isTouched(inputName: string): boolean {
    const input = this.productForm.get(inputName)!;
    return input.touched;
  }
}
