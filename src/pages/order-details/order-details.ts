import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { CartPage } from '../cart/cart';
import { WooProvider } from '../../providers/woo/woo';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { NgZone } from '@angular/core';

@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {
  order: any;
  atual : string = "Visão Geral";
  WooCommerce : any;
  products :any[];
  ready: any = false;
  constructor(public zone : NgZone, public loadingCtrl : LoadingController, public toastCtrl : ToastController , public WC : WooProvider, public modalCtrl : ModalController ,public navCtrl: NavController, public navParams: NavParams) {
    this.WooCommerce = this.WC.init()
    this.products = [];
    this.order = this.navParams.get("order");
    this.ready = false;
  }
  closeModal(){
    this.navCtrl.pop();
  }
  openCart(){
    this.modalCtrl.create(CartPage).present();
  }
loadProducts(){
  let loading = this.loadingCtrl.create({
    content:"Carregando..."
  });
  loading.present();
  try{
    for(let i = 0 ; i < this.order.line_items.length ;i ++){
      this.WooCommerce.getAsync("products/"+this.order.line_items[i].product_id).then( (data)=>{
        
            this.zone.run( ()=>{
              let aux = JSON.parse(data.body).product;
              console.log(aux);
              this.products.push({
                featured_src :aux.featured_src,
                name :aux.title,
                price : aux.price,
                quantity : this.order.line_items[i].quantity
                
              });
              if(i+1 == this.order.line_items.length){
                loading.dismiss();
                this.ready = true;
              }
            })
            
      
      },(err)=>{
        loading.dismiss();
        this.toastCtrl.create({
          message :"Algo Insesperado aconteceu. Estamos trabalhando para corrigir",
          closeButtonText :"OK",
          showCloseButton : true
        }).present();
      })
    }
  }catch(e){
    loading.dismiss();
    this.toastCtrl.create({
      message :"Algo Insesperado aconteceu. Estamos trabalhando para corrigir",
      closeButtonText :"OK",
      showCloseButton : true
    }).present();
  }
  }
  
}
