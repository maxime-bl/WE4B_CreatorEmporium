export class Product {
    constructor(public id: string = "undefined", public name: string = "undefined", public price: number = 0, public seller: string = "undefined", public imagePath: string = "https://padletuploads.blob.core.windows.net/prod/338313757/xv9cNVhJOnCldshv-zjMjA/f41906143bc5eb004cac88418b2a97a7.jpeg"){
    }
}

export interface ProductData {
    name: string;
    price: number;
    seller: string;
    imagePath: string;
  }
