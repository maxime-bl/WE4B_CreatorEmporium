import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/classes/product';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})

export class ProductCardComponent implements OnInit{
  @Input() id: string = "";
  product = new Product("undefinded", 0, "undefined", "https://padletuploads.blob.core.windows.net/prod/338313757/xv9cNVhJOnCldshv-zjMjA/f41906143bc5eb004cac88418b2a97a7.jpeg");
  
  constructor(private databaseService: DatabaseService){
    
  }

  ngOnInit(): void {
      this.databaseService.getProductById(this.id).then(
        product => this.product = product
      )
  }

  

}
