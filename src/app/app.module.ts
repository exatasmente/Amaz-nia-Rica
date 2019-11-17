import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {HttpModule} from '@angular/http';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { Ionic2RatingModule } from "ionic2-rating";

import { HideFab } from '../directives/hide-fab/hide-fab';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AuthProvider } from '../providers/auth/auth';
import { ServiceApi } from '../providers/service/service';



import { MenuPage } from '../pages/menu/menu';
import { HomePage } from '../pages/home/home';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
@NgModule({
  declarations: [
    HideFab,
    MyApp,
    MenuPage,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top',tabsHideOnSubPages: true,tabsHighlight:true,}),
    IonicStorageModule.forRoot(),
    HttpModule,
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MenuPage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PhotoViewer,
    ScreenOrientation,
    InAppBrowser,
    NativePageTransitions,
    AuthProvider,
    ServiceApi
    
  ]
})
export class AppModule {}
