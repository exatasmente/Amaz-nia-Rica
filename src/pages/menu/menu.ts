import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  homePage : any
  
  constructor(public modalCrtl : ModalController , public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = HomePage;
  }

    openHomePage(){
      this.navCtrl.setRoot(HomePage);

    }
    openCartPage(){
      this.navCtrl.push(CartPage);
    }
}
