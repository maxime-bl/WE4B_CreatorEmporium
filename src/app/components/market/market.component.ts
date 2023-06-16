import { Component } from '@angular/core';
import DatabaseService from 'src/app/services/database.service';
import { Product } from 'src/app/classes/product';
import { Seller } from 'src/app/classes/seller';
import { Category } from 'src/app/classes/category';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],
})
export class MarketComponent {
  dbService: DatabaseService;
  products: Product[] = [];
  matchingProducts: Product[] = [];
  categories: Category[] = [];
  sellers: string[] = [];

  selectedSellers: boolean[] = []; // seller selected by the user
  selectedCategory: string = 'all';
  minField: string = '';
  maxField: string = '';
  keywordsField: string = "";

  constructor(dbService: DatabaseService) {
    this.dbService = dbService;

    dbService.getAllProducts().subscribe((res: Product[]) => {
      this.products = res;
      this.matchingProducts = res;
    });

    dbService.getAllSellers().subscribe((res : Seller[]) => {
      this.sellers = res.map(seller => {
        return seller.displayName
      })
      this.selectedSellers = Array(res.length).fill(false);
    });

    dbService.getCategories().subscribe((res: Category[]) => {
      this.categories = res;
    });
  }


  applyFilter() : void {
    // formatting filters value for querying
    const categoryFilter = this.selectedCategory;

    let minPrice: number, maxPrice: number;
    if (isNaN(minPrice = parseInt(this.minField))){
      this.minField = '';
      minPrice = 0;
    }
    if (isNaN(maxPrice = parseInt(this.maxField))){
      this.maxField = '';
      maxPrice = 1000000;
    }

    let sellersFilter: string[] = [];
    this.sellers.forEach((name, index) => {
      if (this.selectedSellers[index]) {
        sellersFilter.push(name);
      }
    });

    // execute query and get products
    this.dbService.getProductsWithFilters(categoryFilter, sellersFilter, minPrice, maxPrice).subscribe((res: Product[]) => {
      this.products = res;
      this.filterByKeyword();
    });
  }


  clearFilters() : void{
    this.selectedCategory = "all";
    this.maxField = "";
    this.minField = "";
    this.selectedSellers.fill(false);
    this.keywordsField = "";

    this.applyFilter();
  }


  filterByKeyword() : void {
    const keywords = this.keywordsField.toLowerCase().split(' ');
    let productList = [...this.products]

    keywords.forEach(keyword => {
      productList = productList.filter(prod => prod.name.toLowerCase().includes(keyword) || prod.description.toLowerCase().includes(keyword));
    })

    this.matchingProducts = productList;
  }

}
