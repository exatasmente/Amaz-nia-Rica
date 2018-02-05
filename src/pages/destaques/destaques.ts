import { Component } from '@angular/core';
import {IonicPage,NavController} from 'ionic-angular';
import { WooProvider } from '../../providers/woo/woo';
import { ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NgZone } from '@angular/core';

@IonicPage()
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
  loadEvent : any;
  constructor(public zone : NgZone, public WC : WooProvider, public navCtrl: NavController, public loadingCrtl: LoadingController , public toastCtrl : ToastController, public modalCtrl : ModalController ) {
    this.WooCommerce = this.WC.init();
    
    let loading = this.loadingCrtl.create({content:'Carregando Produtos'});
    loading.present();
    
    
    this.WooCommerce.getAsync("products").then ( (data)=>{
        try{
        this.zone.run(()=>{
          this.products = JSON.parse(data.body);
          loading.dismiss();
        });
        
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
    if(this.loadEvent)
      this.loadEvent.enable(true);
    this.WooCommerce.getAsync("products").then ( (data)=>{
    
      this.zone.run( ()=>{
        try{
          this.products = JSON.parse(data.body);
          
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
        this.moreProducts =JSON.parse(data.body);
        event.complete();   
        
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
        this.zone.run( ()=>{
          this.moreProducts = this.moreProducts.concat(JSON.parse(data.body));
          if(event != null){
            event.complete();
            if(this.loadEvent == null)
              this.loadEvent = event;
            if(JSON.parse(data.body).products.length < 10){
              this.loadEvent.enable(false);
              this.toastCtrl.create({
                message:"Sem mais Produtos",
                duration:2000}).present();
            }
            
        }
      })
        
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
    this.navCtrl.push('ProductDetailsPage',{product:product});
  }

  openCart(){     
    this.navCtrl.push('CartPage');   
  }  
  swipe(event) {
    if(event.direction === 2) {
      this.navCtrl.parent.select(1);
    }
  }
}
