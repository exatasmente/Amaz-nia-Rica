import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { WooProvider } from '../../providers/woo/woo';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { CartPage } from '../cart/cart';
import { NgZone } from '@angular/core';
import { OrderDetailsPage } from '../order-details/order-details';
import { Http } from '@angular/http';


@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
  WooCommerce : any;
  userOrders : any[];
  constructor(public http : Http, public zone : NgZone, public modalCtrl : ModalController, public storage : Storage ,public WC : WooProvider,public loadingCtrl : LoadingController , public  toastCtrl : ToastController  , public navCtrl: NavController, public navParams: NavParams) {
    this.WooCommerce = this.WC.init();
    this.userOrders = [];
    let loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loading.present();
    this.http.get("http://paranoidlab.xyz/storeApi.php?opt=1&endpoint=orders").subscribe( (rep)=>{
      try{
        let data = rep;

        this.storage.get("userLoginInfo").then( (userInfo)=>{        
        let resp = data.json();
        for(let i = 0 ; i < resp.length ; i++){
          
          if(resp[i].customer_id == userInfo.id){
              this.zone.run( ()=>{
                console.log(resp[1]);
                this.userOrders.push(resp[i]);
              });
              
            
          }
        }
     
      });
      loading.dismiss();   
        
      }catch(e){
          
          loading.dismiss();
          this.toastCtrl.create({
            message:"Algo inseperado aconteceu. Estamos tentando resolver",
            showCloseButton : true,
            closeButtonText: "OK"
          }).present();
      }

    },(err)=>{
    console.log(err);
    loading.dismiss();
    this.toastCtrl.create({
      message:"Algo inseperado aconteceu. Estamos tentando resolver",
      showCloseButton : true,
      closeButtonText: "OK"
    }).present();
    });
  }


  openCart(){
    this.modalCtrl.create(CartPage).present();
  }

  openOrderDetails(order){
    this.modalCtrl.create(OrderDetailsPage,{"order":order}).present();
  }

}
