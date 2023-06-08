import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { FirebaseApp, FirebaseError } from '@angular/fire/app';
import { Observable, from, catchError, throwError, tap, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  app: FirebaseApp;
  auth: Auth;
  user: User | undefined;
  router;

  constructor(databaseService: DatabaseService, router: Router) {
    this.app = databaseService.getAppRef();
    this.auth = getAuth(this.app); // init Firebase Authentification + get reference
    this.router = router;
  }

  login(email: string, password: string, redirectUrl: string) : Observable<string> {
    let returnValue = new Subject<string>;

    from(signInWithEmailAndPassword(this.auth, email, password)).subscribe({
      next: () => {
        // si l'authentification fonctionne
        this.router.navigate([redirectUrl]);
        returnValue.next("");
      },
      error: (fbError: FirebaseError) =>  {
        //si l'authentification échoue
        returnValue.next(fbError.message);
      }
    });

    return returnValue.asObservable();
  }
}
