import { Injectable } from '@angular/core';
import DatabaseService from './database.service';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { FirebaseApp, FirebaseError } from '@angular/fire/app';
import { Observable, from, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../classes/user';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  app: FirebaseApp;
  user: User | null = null;
  userObservable = new Subject<User | null>();
  loggedIn: boolean = false
  router;

  constructor(private databaseService: DatabaseService, private firebaseService: FirebaseService, router: Router, private auth: Auth) {
    this.databaseService = databaseService;
    this.app = firebaseService.getApp()
    this.auth = getAuth(this.app); // init Firebase Authentification + get reference
    this.router = router;



    // action lorsque l'utilisateur se connecte/déconnecte
    onAuthStateChanged(this.auth, async (fbUser) => {
      if (fbUser) {
        const displayName = await databaseService.getDisplayName(fbUser.uid);
        const isSeller = displayName == '' ? false : true;

        this.user = new User(fbUser.uid, fbUser.email, isSeller, displayName)

        this.loggedIn = true;
      } else {
        this.user = null;
        this.loggedIn = false;

      }
      this.userObservable.next(this.user);
    });
  }

  login(
    email: string,
    password: string,
    redirectUrl: string
  ): Observable<string> {
    let returnValue = new Subject<string>();

    from(signInWithEmailAndPassword(this.auth, email, password)).subscribe({
      next: () => {
        // si l'authentification fonctionne
        this.router.navigate([redirectUrl]);
        returnValue.next('');
      },
      error: (error: FirebaseError) => {
        //si l'authentification échoue
        returnValue.next(error.message);
      },
    });

    return returnValue.asObservable();
  }

  async loginAsync(
    email: string,
    password: string,
    redirectUrl: string
  ): Promise<string> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate([redirectUrl]);
      return '';
    } catch (error) {
      return error as string;
    }
  }

  async createUser(
    email: string,
    password: string,
    redirectUrl: string = ''
  ): Promise<string> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);

      this.router.navigate([redirectUrl]);
      return '';
    } catch (error) {
      return error as string;
    }
  }

  async createSeller(
    email: string,
    password: string,
    displayName: string,
    redirectUrl: string = ''
  ): Promise<string> {
    try {
      await this.databaseService.checkDisplayNameAvailability(displayName);

      const uid = (
        await createUserWithEmailAndPassword(this.auth, email, password)
      ).user.uid;

      await this.databaseService.addSeller(uid, displayName);

      this.router.navigate([redirectUrl]);
      return '';
    } catch (error) {
      if (error instanceof FirebaseError) {
        return error.message;
      } else if (error instanceof Error) {
        return error.message;
      } else {
        return "Unknowned error";
      }
    }
  }

  async logout() {
    await signOut(this.auth);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  getCurrentUserAsObservable(): Observable<User | null> {
    return this.userObservable
  }
}
