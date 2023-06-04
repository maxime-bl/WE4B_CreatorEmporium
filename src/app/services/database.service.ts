
import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { Firestore, collection, query, where, getDocs, getDoc, getFirestore} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Product, ProductData} from '../classes/product';

@Injectable({
  providedIn: 'root',
})


export class DatabaseService {
  db : Firestore;

  constructor(private firestore: Firestore) {
    const app = initializeApp(environment.firebase)
    this.db = getFirestore(app);
  }

  async getProductById(id: string) : Promise<Product> {
    
    const productsRef = collection(this.db, "products");
    const q = query(productsRef, where("__name__", "==", id));

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs[0].data() as ProductData;
    const product = new Product(data.name, data.price, data.seller, data.imagePath);
    console.log(data)
    console.log(product)
    return product
}  


  test() :  string{
    return "Coucou c moi"
  }

  
}

