import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { CartPage } from '../cart/cart';
import { SignupPage } from '../signup/signup';
import { Storage } from '@ionic/storage/dist/storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  homePage : any;
  hasLogin : any;
  userData : any;
  constructor(public storage : Storage , public modalCrtl : ModalController , public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = HomePage;
    
  }

  ionViewDidEnter(){
    this.storage.ready().then(()=>{
      this.storage.get("userLoginInfo").then( (userInfo)=>{
        if(userInfo != null){
          this.userData = userInfo;
          
          this.hasLogin = true;
        }else{
          this.hasLogin = false;
        }
      })
    })
  }

  openPageAvatar(){
    if(!this.hasLogin){
      this.navCtrl.push(LoginPage);
    }
  }
  openHomePage(){
      this.navCtrl.popToRoot();

  }
  openCartPage(){
    this.navCtrl.push(CartPage);
  }

  logout(){
    this.storage.remove("userLoginInfo").then( ()=>{
      this.userData = null;
      this.hasLogin = false;
    });
  }
}
