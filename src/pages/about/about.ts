import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


}
