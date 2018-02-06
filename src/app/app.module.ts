import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {HttpModule} from '@angular/http';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { WooProvider } from '../providers/woo/woo';
import { Ionic2RatingModule } from "ionic2-rating";

import { HideFab } from '../directives/hide-fab/hide-fab';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/*
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';

import { ChatProvider } from '../providers/chat/chat';

export const firebaseConfig = {
  apiKey: "AIzaSyAe3-6UUyAWfrFETsQgw8x3U3GyvOGXJgs",
    authDomain: "admin-ia-rica.firebaseapp.com",
    databaseURL: "https://admin-ia-rica.firebaseio.com",
    projectId: "admin-ia-rica",
    storageBucket: "admin-ia-rica.appspot.com",
    messagingSenderId: "493437760991"
};
*/
@NgModule({
  declarations: [
    HideFab,
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top',tabsHideOnSubPages: true}),
    IonicStorageModule.forRoot(),
    HttpModule,
    Ionic2RatingModule
    /*AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule*/
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WooProvider,
    PhotoViewer,
    ScreenOrientation,
    InAppBrowser
    /*AuthProvider,
    UserProvider,
    RequestProvider,
    ChatProvider*/
  ]
})
export class AppModule {}
