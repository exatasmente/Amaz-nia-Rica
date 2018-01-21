import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {MenuPage} from '../pages/menu/menu'
import { Http } from '@angular/http';

import xml2js from 'xml2js';
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
    this.http.post("https://ws.pagseguro.uol.com.br/v2/sessions?email=radiogamerbr@gmail.com&token=58741EDAC9314736BF4E9D4B8A150481",{}
    ).subscribe( (data)=>{
      xml2js.parseString(data.text(), (err,rep)=>{
        let session =JSON.parse(JSON.stringify(rep)).session.id[0];
        PagSeguroDirectPayment.setSessionId(session);
      });
    })
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  
}
