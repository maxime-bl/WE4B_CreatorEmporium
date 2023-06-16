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
  QueryStartAtConstraint,
  Query,
} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Product, ProductData } from '../classes/product';
import { Observable, from, map } from 'rxjs';
import { Seller, SellerData } from '../classes/seller';
import { Category, CategoryData } from '../classes/category';

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

  /* Products functions */

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
          data.seller,
          data.categoryID,
          data.name,
          data.price,
          data.quantity,
          data.description,
          data.imagePath
        );
        return product;
      })
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
            data.seller,
            data.categoryID,
            data.name,
            data.price,
            data.quantity,
            data.description,
            data.imagePath
          );
          products.push(product);
        });
        return products;
      })
    );
  }

  getProductsWithFilters(categoryFilter : string | boolean, sellersFilter : string[], minPrice: number, maxPrice :number) : Observable<Product[]>{
    const productsRef = collection(this.db, 'products');
    let q : Query;
    console.log(categoryFilter, sellersFilter, minPrice, maxPrice);

    if (sellersFilter.length > 0){
      q = query(productsRef, where('categoryID', 'array-contains', categoryFilter),
      where('seller', 'in', sellersFilter),
      where('price', '>=', minPrice),
      where('price', '<=', maxPrice));
    } else {
      q = query(productsRef, where('categoryID', 'array-contains', categoryFilter),
      where('price', '>=', minPrice),
      where('price', '<=', maxPrice));
    }

    const querySnapshot = getDocs(q);

    return from(querySnapshot).pipe(
      map((querySnapshot: QuerySnapshot) => {
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as ProductData;
          const product = new Product(
            doc.id,
            data.seller,
            data.categoryID,
            data.name,
            data.price,
            data.quantity,
            data.description,
            data.imagePath
          );
          products.push(product);
        });
        return products;
      })
    );

  }

  /* Sellers functions */

  async getDisplayName(uid: string): Promise<string> {
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

  getAllSellers(): Observable<Seller[]> {
    const sellersRef = collection(this.db, 'sellers');

    return from(getDocs(sellersRef)).pipe(
      map((querySnapshot: QuerySnapshot) => {
        const sellers: Seller[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as SellerData;
          const seller = new Seller(doc.id, data.displayName);
          sellers.push(seller);
        });
        return sellers;
      })
    );
  }

  async addSeller(uid: string, displayName: string) {
    try {
      await setDoc(doc(this.db, 'sellers', uid), {
        displayName: displayName,
      });
    } catch (error) {
      throw error;
    }
  }

  async checkDisplayNameAvailability(displayName: string): Promise<boolean> {
    const sellersRef = collection(this.db, 'sellers');
    const q = query(sellersRef, where('displayName', '==', displayName));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return true;
    } else {
      throw new Error('Display name already used');
    }
  }

  /* Others */

  getCategories() : Observable<Category[]> {
    const catRef = collection(this.db, 'categories');


    return from(getDocs(catRef)).pipe(
      map((querySnapshot: QuerySnapshot) => {
        const categories: Category[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as CategoryData;
          const cat = new Category(doc.id, data.name);
          categories.push(cat);
        });
        return categories;
      })
    );
  }
}
