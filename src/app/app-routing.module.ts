import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { MarketComponent } from './components/market/market.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { MoreInfoComponent } from './components/more-info/more-info.component';
import { NewProductComponent } from './components/new-product/new-product.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: 'market', component: MarketComponent},
  {path: 'product/:id', component: ProductPageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'more-info', component: MoreInfoComponent},
  {path: 'newproduct', component: NewProductComponent},
  {path: 'transactions', component: TransactionHistoryComponent},
  {path: 'product-management', component: ProductManagementComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
