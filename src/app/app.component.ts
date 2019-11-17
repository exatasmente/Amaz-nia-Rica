import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { Http } from '@angular/http';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { MenuPage } from '../pages/menu/menu';


declare var PagSeguroDirectPayment;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage :any = MenuPage;
  
  constructor(public screenOrientation: ScreenOrientation,public http : Http, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    
    this.initializeApp();
    
  }

  initializeApp() {
    this.http.get("http://amazoniaricaapi.000webhostapp.com/api.php?opt=session"
    ).subscribe( (data)=>{
        let session = data.json();
        PagSeguroDirectPayment.setSessionId(session.id);
    });
    this.platform.ready().then(() => {
      
        if (this.platform.is('android')) {
          this.statusBar.backgroundColorByHexString("#33000000");
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        }
       
      this.splashScreen.hide();
    });
  }

  
}
