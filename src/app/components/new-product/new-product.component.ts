import { Component } from '@angular/core';
import { Data } from '@angular/router';
import DatabaseService from 'src/app/services/database.service';
import { Category } from 'src/app/classes/category';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {
  dbService : DatabaseService;
  categoryList: Category[] = []

  productForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('')
  })

  constructor(databaseService: DatabaseService){
    this.dbService = databaseService;

    this.dbService.getCategories().subscribe((res) => {
      this.categoryList = res;
      console.log(this.categoryList)
    })


    
  }

  submit() : void {

  }
}
