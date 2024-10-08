import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { MoneyPipe } from './pipes/money.pipe';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import DatabaseService from './services/database.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarketComponent } from './components/market/market.component';
import { FiltersComponent } from './components/filters/filters.component';
import { MoreInfoComponent } from './components/more-info/more-info.component';
import { NewProductComponent } from './components/new-product/new-product.component';
import { StorageService } from './services/storage.service';
import { FirebaseService } from './services/firebase.service';
import { CommentComponent } from './components/comment/comment.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { CartService } from './services/cart.service';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { ProductEditionCardComponent } from './components/product-edition-card/product-edition-card.component';
import { CartComponent } from './components/cart/cart.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductCardComponent,
    ProductListComponent,
    MoneyPipe,
    LoginComponent,
    RegisterComponent,
    ProductPageComponent,
    HomeComponent,
    LanguageSelectorComponent,
    MarketComponent,
    FiltersComponent,
    MoreInfoComponent,
    NewProductComponent,
    CommentComponent,
    CommentListComponent,
    CommentFormComponent,
    TransactionHistoryComponent,
    ProductManagementComponent,
    ProductEditionCardComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    HttpClientModule,
    TranslocoRootModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    FirebaseService,
    DatabaseService,
    AuthService,
    StorageService,
    CartService   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
