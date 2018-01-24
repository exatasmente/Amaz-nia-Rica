import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {MenuPage} from '../pages/menu/menu'
import { Http } from '@angular/http';


declare var PagSeguroDirectPayment;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage :any = MenuPage;
  
  constructor(public http : Http, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    
    this.initializeApp();
    
  }

  initializeApp() {
    this.http.get("http://paranoidlab.xyz/amazoniarica/api.php?opt=session"
    ).subscribe( (data)=>{
        let session = data.json();
        PagSeguroDirectPayment.setSessionId(session.id);
    });
    this.platform.ready().then(() => {
      
      this.statusBar.backgroundColorByHexString('#72b817');
      this.splashScreen.hide();
    });
  }

  
}
