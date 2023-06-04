import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/classes/product';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})

export class ProductCardComponent{
  @Input() product: Product = new Product("","", 0,"","");
  
  constructor(){
  }
}
