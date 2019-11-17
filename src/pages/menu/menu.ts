import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { Storage } from '@ionic/storage/dist/storage';
//import firebase from 'firebase';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  homePage: any;
  hasLogin: any;
  userData: any;
  constructor(public storage: Storage, public modalCrtl: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = HomePage;

  }

  ionViewDidEnter() {

    this.storage.ready().then(() => {
      this.storage.get("userLogin").then((userInfo) => {
        if (userInfo != null) {
          this.userData = userInfo;
          console.log(this.userData);
          this.hasLogin = true;
        } else {
          this.hasLogin = false;
        }
      })
    })
  }
  openAboutPage() {
    this.navCtrl.push('AboutPage');
  }
  openPageAvatar() {
    if (!this.hasLogin) {
      this.navCtrl.push('LoginPage');
    } else {
      this.navCtrl.push('UserInfoPage');
    }
  }
  openHomePage() {
    this.navCtrl.popToRoot();

  }
  openCartPage() {
    this.navCtrl.push('CartPage');
  }
  openOrdersPage() {
    this.navCtrl.push('OrdersPage');
  }

  logout() {
    this.storage.clear().then(()=>{
      this.userData = null;
      this.hasLogin = false;
      /*firebase.auth().signOut().then(() => {
        this.navCtrl.parent.parent.setRoot('LoginPage');
      })*/



    });
  }
}