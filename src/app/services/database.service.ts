import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  getFirestore,
  QuerySnapshot,
} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Product, ProductData } from '../classes/product';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  db: Firestore;

  constructor(private firestore: Firestore) {
    const app = initializeApp(environment.firebase);
    this.db = getFirestore(app);
  }


  getProductById(id: string): Observable<Product> {
    const productsRef = collection(this.db, 'products');
    const q = query(productsRef, where('__name__', '==', id));

    const querySnapshotPromise = getDocs(q);

    return from(querySnapshotPromise).pipe(
      map((querySnapshot : QuerySnapshot) => {
        const doc = querySnapshot.docs[0]
        const data = doc.data() as ProductData;
        const product = new Product(
          doc.id,
          data.name,
          data.price,
          data.seller,
          data.imagePath
        );
        return product;
      })
    )
    
  }



  getAllProducts(): Observable<Product[]> {
    const productsRef = collection(this.db, 'products');
    const querySnapshotPromise = getDocs(productsRef);
  
    return from(querySnapshotPromise).pipe(
      map((querySnapshot: QuerySnapshot) => {
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as ProductData;
          const product = new Product(
            doc.id,
            data.name,
            data.price,
            data.seller,
            data.imagePath
          );
          products.push(product);
        });
        return products;
      })
    );
  }
}