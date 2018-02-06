import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WooProvider } from '../../providers/woo/woo';
import { NgZone } from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-seller-contact',
  templateUrl: 'seller-contact.html',
})
export class SellerContactPage {
  orderItems ;
  wooCommerce ;
  products =[];
  constructor(public zone : NgZone ,public WC : WooProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.orderItems = this.navParams.get('items');
    console.log(this.orderItems);
    this.wooCommerce = WC.init();
    for(let i = 0 ; i < this.orderItems.length ; i++)
    this.wooCommerce.getAsync('products/'+this.orderItems[i].product_id).then( (data)=>{
      let prod = JSON.parse(data.body);
      
      this.zone.run(()=>{
        this.products.push(prod);
      });
      
    });
  }
  
}
