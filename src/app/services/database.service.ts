import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  getFirestore,
  QuerySnapshot,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Product, ProductData } from '../classes/product';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class DatabaseService {
  db: Firestore;
  app: FirebaseApp;

  constructor(private firestore: Firestore) {
    this.app = initializeApp(environment.firebase);
    this.db = getFirestore(this.app);
  }

  getAppRef(): FirebaseApp {
    return this.app;
  }

  getDbRef(): Firestore {
    return this.db;
  }

  /* Getters functions */

  getProductById(id: string): Observable<Product> {
    const productsRef = collection(this.db, 'products');
    const q = query(productsRef, where('__name__', '==', id));

    const querySnapshotPromise = getDocs(q);

    return from(querySnapshotPromise).pipe(
      map((querySnapshot: QuerySnapshot) => {
        const doc = querySnapshot.docs[0];
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
    );
  }

  async getDisplayName(uid: string) : Promise<string>{
    return getDoc(doc(this.db, 'sellers', uid)).then(
      (docSnapshot: DocumentSnapshot) => {
        if (docSnapshot.exists()) {
          return docSnapshot.data()['displayName'];
        } else {
          return '';
        }
      }
    );
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

  async addSeller(uid: string, displayName: string){
    try {
      await setDoc(doc(this.db, 'sellers', uid), {
        'displayName' : displayName
      })
    } catch (error) {
      throw error;
    }
  }

  async checkDisplayNameAvailability(displayName: string): Promise<boolean>{
    const sellersRef = collection(this.db, 'sellers');
    const q = query(sellersRef, where("displayName", "==", displayName));

    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty){
      return true;
    } else {
      throw new Error("Display name already used");
    }
  }
}
