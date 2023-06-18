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
  addDoc,
  Query,
  updateDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
} from '@angular/fire/firestore';

import { Product, ProductData } from '../classes/product';
import { Observable, firstValueFrom, from, map } from 'rxjs';
import { Seller, SellerData } from '../classes/seller';
import { Category, CategoryData } from '../classes/category';
import { StorageService } from './storage.service';
import { FirebaseService } from './firebase.service';
import { Comment } from '../classes/comment';
import { Transaction } from '../classes/transaction';

@Injectable({
  providedIn: 'root',
})
export default class DatabaseService {
  db: Firestore;
  app: FirebaseApp;

  constructor(private firebaseService: FirebaseService, private storageService: StorageService) {
    this.app = firebaseService.getApp();
    this.db = getFirestore(this.app);
  }

  

  getDbRef(): Firestore {
    return this.db;
  }

  /* Products functions */

  async addProduct(name: string, description: string, price: number, quantity: number, categoryID: string, image: File, sellerName: string, sellerID: string) : Promise<string>{
    try {
      const prodRef = await addDoc(collection(this.db, 'products'), {
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        categoryID: ["all", categoryID],
        imagePath: "",
        seller: sellerName,
        sellerID: sellerID
      })

      const imageURL = await this.storageService.uploadProductImage(prodRef.id, image);

      await updateDoc(prodRef, {
        imagePath: imageURL
      });

      return prodRef.id
    } catch (error) {
      throw new Error("Product creation failed")
    }
  }

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
          data.imagePath,
          data.sellerID
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
            data.imagePath,
            data.sellerID
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
            data.imagePath,
            data.sellerID
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

    const q = query(catRef, orderBy("name"));

    return from(getDocs(q)).pipe(
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

  /* Comment functions */

  getCommentsForProduct(productID: string) : Observable<Comment[]>{
    const commentsRef = collection(this.db, 'comments');

    const q = query(commentsRef, where('productID', '==', productID));

    return from(getDocs(q)).pipe(
      map((querySnapshot: QuerySnapshot) => {
        const comments: Comment[] = [];
        querySnapshot.forEach((doc) => {
          const comment = doc.data() as Comment;
          comments.push(comment);
        });
        return comments;
      })
    );
  }

  async addComment(productID: string, userID: string, username: string, title: string, text: string, grade: number) : Promise<boolean>{
    try {
      const commentsRef = collection(this.db, "comments");

      await addDoc(commentsRef, {
        productID: productID,
        userID: userID,
        username: username,
        title: title,
        text: text,
        grade: grade
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  async checkForExistingComment(userID: string, productID: string) : Promise<boolean> {
    const commentsRef = collection(this.db, 'comments');
    const q = query(commentsRef, where('productID', '==', productID), where('userID', '==', userID));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return false;
    } else {
      return true
    }
  } 

  /* Transaction functions */

  getTransactionByUserID(userID: string): Observable<Transaction[]>{
    const transactionsRef = collection(this.db, 'orders');

    const q = query(transactionsRef, where('userID', '==', userID));

    return from(getDocs(q)).pipe(
      map((querySnapshot: QuerySnapshot) => {
        const transactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          const transaction = doc.data() as Transaction;
          transactions.push(transaction);
        });
        return transactions;
      })
    );
  }

  getTransactionBySellerID(sellerID: string): Observable<Transaction[]>{
    const transactionsRef = collection(this.db, 'orders');

    const q = query(transactionsRef, where('sellerID', '==', sellerID));

    return from(getDocs(q)).pipe(
      map((querySnapshot: QuerySnapshot) => {
        const transactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          const transaction = doc.data() as Transaction;
          transactions.push(transaction);
        });
        return transactions;
      })
    );
  }

  getProductByUserId(id: string): Observable<Product[]> {
    const productsRef = collection(this.db, 'products');
    const q = query(productsRef, where('sellerID', '==', id));

    return from(getDocs(q)).pipe(
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
            data.imagePath,
            data.sellerID
          );
          products.push(product);
        });
        return products;
      })
    );
  }

  async updateProduct(productID: string, quantity: number) {
    const productRef = collection(this.db, 'products');
    const q = query(
      productRef,
      where('__name__', '==', productID)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('Product not found');
      }

      const itemRef = querySnapshot.docs[0].ref;
      updateDoc(itemRef, {
        quantity: quantity,
      });
      return productID;
    } catch (error) {
      throw error;
    }
  }

  async removeProduct(productID: string) {
    const productRef = collection(this.db, 'products');
    const q = query(
      productRef,
      where('__name__', '==', productID)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('Product not found');
      }

      const itemRef = querySnapshot.docs[0].ref;
      await deleteDoc(itemRef);
      location.reload();
    } catch (error) {
      throw error;
    }
  }

  addTransaction(productID : string, productName: string, quantity: number, sellerID: string, sellerName: string, userID: string, username: string, totalPrice: number){
    const transacRef = collection(this.db, 'transactions');

    addDoc(transacRef, {
      date: serverTimestamp(),
      productID: productID,
      productName: productName,
      quantity: quantity,
      sellerID: sellerID,
      sellerName: sellerName,
      userID: userID,
      username: username,
      totalPrice: totalPrice,
    })
  }
}
