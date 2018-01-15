import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import {HttpModule} from '@angular/http';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { DestaquesPage } from '../pages/destaques/destaques';
import { CategoriasPage } from '../pages/categorias/categorias';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuPage } from '../pages/menu/menu';


import { ProductDetailsPage } from '../pages/product-details/product-details';
import { ProductsbyCategoryPage } from '../pages/productsby-category/productsby-category';

import { IonicStorageModule } from '@ionic/storage';
import { CartPage } from '../pages/cart/cart';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { WooProvider } from '../providers/woo/woo';
import { NuvemShopApiProvider } from '../providers/nuvem-shop-api/nuvem-shop-api';
import { OrdersPage } from '../pages/orders/orders';
import { OrderDetailsPage } from '../pages/order-details/order-details';
//import { HTTP } from '@ionic-native/http';





@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MenuPage,
    ProductDetailsPage,
    SignupPage,    
    ProductsbyCategoryPage,
    CartPage,
    LoginPage,
    DestaquesPage,
    CategoriasPage,
    OrdersPage,
    OrderDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top',tabsHideOnSubPages: true}),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MenuPage,
    ProductDetailsPage,
    ProductsbyCategoryPage,
    CartPage,
    SignupPage,
    LoginPage,
    DestaquesPage,
    CategoriasPage,
    OrdersPage,
    OrderDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WooProvider
    //HTTP,
    //NuvemShopApiProvider
    
  ]
})
export class AppModule {}
