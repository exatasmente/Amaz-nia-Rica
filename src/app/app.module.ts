import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuPage } from '../pages/menu/menu';


import { ProductDetailsPage } from '../pages/product-details/product-details';
import { ProductsbyCategoryPage } from '../pages/productsby-category/productsby-category';

import { IonicStorageModule } from '@ionic/storage';
import { CartPage } from '../pages/cart/cart';




@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MenuPage,
    ProductDetailsPage,
    
    ProductsbyCategoryPage,
    CartPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MenuPage,
    ProductDetailsPage,
    ProductsbyCategoryPage,
    CartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
