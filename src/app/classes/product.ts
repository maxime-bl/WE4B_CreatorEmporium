export class Product {
  constructor(
    public productID: string = 'undefined',
    public seller: string = 'undefined',
    public categoryID: string = 'undefined',
    public name: string = 'undefined',
    public price: number = 0,
    public quantity: number = 0,
    public description: string = 'undefined',   
    public imagePath: string = 'https://padletuploads.blob.core.windows.net/prod/338313757/xv9cNVhJOnCldshv-zjMjA/f41906143bc5eb004cac88418b2a97a7.jpeg',
    public inCart: boolean = false
  ) {}
}

export interface ProductData {
  productID: string;
  seller: string;
  categoryID: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imagePath: string;
  inCart: boolean;
}
