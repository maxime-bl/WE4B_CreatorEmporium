import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import DatabaseService from './database.service';
import {
  CollectionReference,
  Firestore,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { CartItem } from '../classes/cart-item';
import { Observable, firstValueFrom, from, map } from 'rxjs';
import { Product, ProductData } from '../classes/product';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItemsRef: CollectionReference;
  db: Firestore;

  constructor(
    private fbService: FirebaseService,
    private dbService: DatabaseService
  ) {
    this.db = this.dbService.getDbRef();
    this.cartItemsRef = collection(this.db, 'cart-items');
  }

  addToCart(userID: string, productID: string, quantity: number) {
    addDoc(this.cartItemsRef, {
      userID: userID,
      productID: productID,
      quantity: quantity,
    });
  }

  async updateCartItem(userID: string, productID: string, quantity: number) {
    const q = query(
      this.cartItemsRef,
      where('userID', '==', userID),
      where('productID', '==', productID)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('Cart item not found');
      }

      const itemRef = querySnapshot.docs[0].ref;
      updateDoc(itemRef, {
        quantity: quantity,
      });
    } catch (error) {
      throw error;
    }
  }

  getCartItems(userID: string): Observable<CartItem[]> {
    const q = query(this.cartItemsRef, where('userID', '==', userID));

    return from(getDocs(q)).pipe(
      map((querySnapshot: QuerySnapshot) => {
        const items: CartItem[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const item = {
            userID: data['userID'],
            productID: data['productID'],
            quantity: data['quantity'],
          };
          items.push(item);
        });
        return items;
      })
    );
  }

  async removeFromCart(userID: string, productID: string) {
    const q = query(
      this.cartItemsRef,
      where('userID', '==', userID),
      where('productID', '==', productID)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('Cart item not found');
      }

      const itemRef = querySnapshot.docs[0].ref;
      await deleteDoc(itemRef);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async purchaseCart(user: User, cartItems: CartItem[]) : Promise<boolean> {
    // 1 : vérifier pour chaque item que quantité voulue <= stock produit
    const productsRef = collection(this.db, 'products');
    const checkAvailabilityPromises: Promise<boolean>[] = [];
    let productMap = new Map<string, Product>();

    for (const cartItem of cartItems) {
      const productRef = doc(productsRef, cartItem.productID);

      const checkAvailabilityPromise = getDoc(productRef)
        .then((productDoc) => {
          if (productDoc.exists()) {
            const productData = productDoc.data() as ProductData;
            const prod = new Product(
              productDoc.id,
              productData.seller,
              productData.categoryID,
              productData.name,
              productData.price,
              productData.quantity,
              productData.description,
              productData.imagePath,
              productData.sellerID
            );
            productMap.set(productDoc.id, prod);
            return productData.quantity >= cartItem.quantity;
          } else {
            return false;
          }
        })
        .catch((error) => {
          console.error('Error retrieving product:', error);
          throw error;
        });

      checkAvailabilityPromises.push(checkAvailabilityPromise);
    }

    const availabilityResults = await Promise.all(checkAvailabilityPromises);
    const allProductsAvailable = availabilityResults.every(
      (availability) => availability
    );

    if (allProductsAvailable) {
      for (const cartItem of cartItems) {
        const currentProd = productMap.get(cartItem.productID)!;

        // 2 : modifier stock pour chaque item
        this.dbService.updateProduct(
          cartItem.productID,
          currentProd?.quantity - cartItem.quantity
        );
        // 3 : créer une transaction pour chaque item
        const totalPrice = cartItem.quantity * currentProd.price;
        this.dbService.addTransaction(
          cartItem.productID,
          currentProd.name,
          cartItem.quantity,
          currentProd.sellerID,
          currentProd.seller,
          user.uid,
          user.displayName,
          totalPrice
        );
        // 4 : supprimer tous les items du panier
        this.removeFromCart(cartItem.userID, cartItem.productID);
      }

      return true;
    } else {
      console.log('Error : Some products are not available');
      throw new Error('Some products are not available');
    }
  }
}
