import { Component } from '@angular/core';
import {IonicPage,NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

import { WooProvider } from '../../providers/woo/woo';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { NgZone } from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  modal: any;
  product :any;
  WooCommerce : any;
  related : any[] = [];
  variations : any[] = [];
  ready:any 
  atual = "Visão Geral";
  reviews : any[];
  constructor(public zone : NgZone ,public loadingCtrl : LoadingController, public WC : WooProvider, public modalCtrl : ModalController, public navCtrl: NavController, public navParams: NavParams, public storage : Storage, public toastCtrl : ToastController) {
    this.ready = false;
    
    this.WooCommerce = WC.init();
    this.product =this.navParams.get("product");
    console.log(this.product);
    let temp = this.navParams.get("modal");
    
    if(temp != null){
      this.modal = true;
    }else{
      this.modal = false;
    }
    
    this.WooCommerce.getAsync("products/"+this.product.id+"/reviews").then ( (data)=>{
        this.zone.run( ()=>{
          this.reviews = JSON.parse(data.body);
          console.log(this.reviews);
        });
        
        
    });
      
  
  }

  loadRelated(event){
    let i= 0;
    let aux : any[];
    aux = [];
    event.complete();
    this.product.related_ids.forEach(id => {
      i++;
      
      this.WooCommerce.getAsync("products/"+id).then ( (data2)=>{        
      aux.push( (JSON.parse(data2.body)));
      if(i == this.product.related_ids.length){
        this.zone.run(()=>{
          this.ready = true;
          this.related = aux;
          
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
        let seller_id;
        product.attributes.forEach(att => {
          if(att.name == "seller_id"){
            seller_id = att.options[0];
          }
        });
        data.push({
          product: product,
          qty: 1,
          amount: parseFloat(product.price),
          seller_id : seller_id
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
    this.navCtrl.push('ProductDetailsPage',{product:item});
  }
  openSearch(){
    this.navCtrl.push('SearchPage');
  }
  openCart(){     
    this.navCtrl.push('CartPage');   
  }  

}
