import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app: FirebaseApp;

  constructor(private firebaseApp: FirebaseApp) {
    this.app = initializeApp(environment.firebase)
   }

   getApp(): FirebaseApp {
    return this.app;
  }
}
