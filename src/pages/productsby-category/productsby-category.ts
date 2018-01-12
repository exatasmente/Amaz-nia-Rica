import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';
import * as WC from 'woocommerce-api';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';


import {CartPage} from '../cart/cart';


@Component({
  selector: 'page-productsby-category',
  templateUrl: 'productsby-category.html',
})
export class ProductsbyCategoryPage {
  WooCommerce : any;
  categoryProducts: any[];
  cat:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCrtl: LoadingController, public modalCtrl : ModalController) {
    this.cat = this.navParams.get("category");
  
    this.WooCommerce = WC({
      url:"http://amazoniaricaapi2.000webhostapp.com",
      consumerKey:"ck_28dcf620b43da4f18cfcdec2cf64fa2fe0b6962c",
      consumerSecret:"cs_53de2296470c647c17657fca469d6af1dea697cb"
      
    });
    let loading = this.loadingCrtl.create({content:'Carregando Produtos'});
    loading.present();

    this.WooCommerce.getAsync("products?filter[category]="+this.cat.slug).then ( (data)=>{
        console.log(JSON.parse(data.body));
        this.categoryProducts = JSON.parse(data.body).products;
        loading.dismiss();
    },(err)=>{
      console.log(err);
      loading.dismiss();
    });
    
 
  }

  openProductPage(product){
    
    let profileModal = this.modalCtrl.create(ProductDetailsPage,{product:product,modal:"modal"});
    profileModal.present();
  
    
  } 
  

  openCart(){
    this.modalCtrl.create(CartPage).present();
  }

}
