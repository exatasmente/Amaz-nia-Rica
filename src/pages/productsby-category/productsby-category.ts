import { Component } from '@angular/core';
import {IonicPage,NavController, NavParams } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';


import { WooProvider } from '../../providers/woo/woo';

@IonicPage()
@Component({
  selector: 'page-productsby-category',
  templateUrl: 'productsby-category.html',
})
export class ProductsbyCategoryPage {
  WooCommerce : any;
  categoryProducts: any[];
  cat:any;
  
  constructor(public WC : WooProvider, public navCtrl: NavController, public navParams: NavParams, public loadingCrtl: LoadingController, public modalCtrl : ModalController) {
    this.cat = this.navParams.get("category");
  
    this.WooCommerce = this.WC.init();
    let loading = this.loadingCrtl.create({content:'Carregando Produtos'});
    loading.present();

    this.WooCommerce.getAsync("products?filter[category]="+this.cat.slug).then ( (data)=>{
        console.log(JSON.parse(data.body));
        this.categoryProducts = JSON.parse(data.body);
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
    this.navCtrl.push('CartPage');   
  }  

}
