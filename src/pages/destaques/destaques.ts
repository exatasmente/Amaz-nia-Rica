import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { WooProvider } from '../../providers/woo/woo';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ProductDetailsPage } from '../product-details/product-details';

import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-destaques',
  templateUrl: 'destaques.html',
})
export class DestaquesPage {
  page : any;
  moreProducts: any[];
  products : any[];
  WooCommerce : any;
  tabBar : any;
  constructor(public WC : WooProvider, public navCtrl: NavController, public loadingCrtl: LoadingController , public toastCtrl : ToastController, public modalCtrl : ModalController ) {
    this.WooCommerce = this.WC.init();
    
    let loading = this.loadingCrtl.create({content:'Carregando Produtos'});
    loading.present();
    
    this.WooCommerce.getAsync("products").then ( (data)=>{
        console.log(JSON.parse(data.body));
        this.products = JSON.parse(data.body).products;
        loading.dismiss();
    },(err)=>{
      console.log(err);
      loading.dismiss();
    });
    
    
    this.loadMoreProducts(null);
  }



  
  loadMoreProducts(event){
    console.log("carrega Mais");
    if(event == null){
      this.page = 2;
      this.moreProducts = [];
    }else{
      this.page++;
    }
    
    this.WooCommerce.getAsync("products?page="+this.page).then ( (data)=>{
      console.log(JSON.parse(data.body).products);
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);
      if(event != null){
        event.complete();
        
        if(JSON.parse(data.body).products.length < 10){
          event.enable(false);
          this.toastCtrl.create({
            message:"Sem mais Produtos",
            duration:2000}).present();
        }
      }

      
  },(err)=>{
    console.log(err);
  });


  }
  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage,{product:product});
  }

  openCart(){
    this.modalCtrl.create(CartPage).present();
  }
  swipe(event) {
    if(event.direction === 2) {
      this.navCtrl.parent.select(1);
    }
  }
}
