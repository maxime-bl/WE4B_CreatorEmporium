export class Product {
    constructor(public id: string, public name: string, public price: number, public seller: string, public imagePath: string){
    }
}

export interface ProductData {
    name: string;
    price: number;
    seller: string;
    imagePath: string;
  }