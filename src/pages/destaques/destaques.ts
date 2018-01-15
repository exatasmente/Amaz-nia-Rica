import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { WooProvider } from '../../providers/woo/woo';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ProductDetailsPage } from '../product-details/product-details';

import { CartPage } from '../cart/cart';
import { NgZone } from '@angular/core';

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
  constructor(public zone : NgZone, public WC : WooProvider, public navCtrl: NavController, public loadingCrtl: LoadingController , public toastCtrl : ToastController, public modalCtrl : ModalController ) {
    this.WooCommerce = this.WC.init();
    
    this.WooCommerce.getAsync("orders").then( (data)=>{
        console.log( JSON.parse(data.body));
    });

    let loading = this.loadingCrtl.create({content:'Carregando Produtos'});
    loading.present();
    
    this.WooCommerce.getAsync("products").then ( (data)=>{
        try{
        console.log(JSON.parse(data.body));
        this.products = JSON.parse(data.body).products;
        loading.dismiss();
        }catch(e){
          loading.dismiss();
          this.toastCtrl.create({
            message:"Algo Inesperado Aconteceu, Estamos tentando Resolver",
            closeButtonText :"Ok",
            showCloseButton : true
            
          }).present();
        }
        
    },(err)=>{
      loading.dismiss();
          this.toastCtrl.create({
            message:"Algo Inesperado Aconteceu, Estamos tentando Resolver",
            closeButtonText :"Ok",
            showCloseButton : true
            
          }).present();
      
    });
    
    
    this.loadMoreProducts(null);
  }


  doRefresh(event){
    this.WooCommerce.getAsync("products").then ( (data)=>{
    
      this.zone.run( ()=>{
        try{
          this.products = JSON.parse(data.body).products;  
          
        }catch(e){
          
          this.toastCtrl.create({
            message:"Algo Inesperado Aconteceu, Estamos tentando Resolver",
            closeButtonText :"Ok",
            showCloseButton : true
            
          }).present();
        }
      });
      
  },(err)=>{
  
          this.toastCtrl.create({
            message:"Algo Inesperado Aconteceu, Estamos tentando Resolver",
            closeButtonText :"Ok",
            showCloseButton : true
            
          }).present();
  
  });
  this.moreProducts = [];
  this.WooCommerce.getAsync("products?page="+2).then ( (data)=>{
    this.zone.run ( ()=>{
      try{
        this.moreProducts =JSON.parse(data.body).products;
        event.complete();   
        event.enable(false);    
      }catch(e){
          event.complete();   
          this.toastCtrl.create({
            message:"Algo Inesperado Aconteceu, Estamos tentando Resolver",
            closeButtonText :"Ok",
            showCloseButton : true
            
          }).present();
      }
    });
    
  },(err)=>{
    console.log(err);
  });

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
      try{
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
    }catch(e){
      event.complete();   
      this.toastCtrl.create({
        message:"Algo Inesperado Aconteceu, Estamos tentando Resolver",
        closeButtonText :"Ok",
        showCloseButton : true
        
      }).present();
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
