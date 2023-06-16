import { Component } from '@angular/core';
import { Data } from '@angular/router';
import DatabaseService from 'src/app/services/database.service';
import { Category } from 'src/app/classes/category';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {
  dbService : DatabaseService;
  categoryList: Category[] = []
  
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

  constructor(databaseService: DatabaseService){
    this.dbService = databaseService;

    this.dbService.getCategories().subscribe((res) => {
      this.categoryList = res;
    })


    
  }

  submit() : void {
    console.log("image valide :", this.isImageValid);
    console.log("qtté valide :", this.isQuantityValid);
    console.log("prixvalide :", this.isPriceValid);
    
    console.log("Form valide : ", this.productForm.valid)

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.isImageValid = this.productForm.get('imgFile')?.value != '' && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
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
