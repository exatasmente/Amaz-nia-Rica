import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Alert } from 'ionic-angular/components/alert/alert';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

import {CartPage} from '../cart/cart';
import { WooProvider } from '../../providers/woo/woo';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { NgZone } from '@angular/core';


@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  modal: any;
  product :any;
  WooCommerce : any;
  related : any[] = [];
  ready:any 
  atual = "Visão Geral";

  constructor(public zone : NgZone ,public loadingCtrl : LoadingController, public WC : WooProvider, public modalCtrl : ModalController, public navCtrl: NavController, public navParams: NavParams, public storage : Storage, public toastCtrl : ToastController) {
    this.ready = false;
    
    this.WooCommerce = WC.init();
    this.product =this.navParams.get("product");
    
    let temp = this.navParams.get("modal");
    
    if(temp != null){
      this.modal = true;
    }else{
      this.modal = false;
    }
    
  }

  loadRelated(event){
    let i= 0;
    let aux : any[];
    aux = [];

    this.product.related_ids.forEach(id => {
      i++;
      
      this.WooCommerce.getAsync("products/"+id).then ( (data2)=>{        
      aux.push( (JSON.parse(data2.body)).product );
      if(i == this.product.related_ids.length){
        this.zone.run(()=>{
          this.ready = true;
          this.related = aux;
          event.complete();
          event.enable(false);
        });
        
        
        
       
      }
    });
  }); 
  }

  closeModal(){
    this.navCtrl.pop();
  }
  
  addToCart(product){
    this.storage.get("cart").then( (data=>{
      
      if(data == null || data.length == 0){
        data = [];

        data.push({
          product: product,
          qty: 1,
          amount: parseFloat(product.price)
        })
        this.storage.set("cart",data).then(()=>{
          this.toastCtrl.create({
            message:"Produto adicionado",
            duration: 2000,
            position:"top"
          }).present();
        })
      }else{
        let added =0;
        for(let i = 0 ;  i < data.length ; i++){
          if(product.id == data[i].product.id){
            let qty = data[i].qty;

            data[i].qty = qty+1;

            data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);

            added = 1;
            break;
          }
        }
        if(added ==0 ){
          data.push({
            product: product,
            qty: 1,
            amount: parseFloat(product.price)
          })
        }

        this.storage.set("cart",data).then(()=>{
          this.toastCtrl.create({
            message:"Produto adicionado Ao Carrinho",
            duration: 2000,
            position :"top"

          }).present();
        })
      }


    }),(err =>{
      console.log(err);
    }))
  }
  openDetails(item){
    this.navCtrl.push(ProductDetailsPage,{product:item});
  }

  openCart(){
    this.modalCtrl.create(CartPage).present();
  }

}
