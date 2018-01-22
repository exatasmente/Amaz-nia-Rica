import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage/dist/storage';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { MenuPage } from '../menu/menu';
import { SignupPage } from '../signup/signup';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { CheckoutPage } from '../checkout/checkout';
import { MyApp } from '../../app/app.component';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username : string;
  password : string;
  constructor(public toastCtrl : ToastController  ,public loadingCtrl: LoadingController ,public http: Http , public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.username = "";
    this.password = "";
    
  }

  login(){
    let loading = this.loadingCtrl.create({
      content:"Aguarde..."
    });
    loading.present();
    this.http.get("http://amazoniaricaapi.000webhostapp.com/api/get_nonce/?controller=user&method=generate_auth_cookie").subscribe( (data)=>{
      let nonce = data.json().nonce;
      if(nonce != null){
          this.http.get("https://amazoniaricaapi.000webhostapp.com/api/user/generate_auth_cookie/?username="+this.username +"&password="+this.password).subscribe( (data1)=>{
            
            this.http.get("http://localhost:8100/storeApi?opt=1&endpoint=customers/"+data1.json().user.id).subscribe( rep =>{
              let response = rep.json();
              if(response.error){
                loading.dismiss().then( ()=>{              
                  this.toastCtrl.create({
                    message : response.error,
                    showCloseButton : true,
                    closeButtonText : "OK"
                  }).present();
                })
  
              }else{
                
                this.storage.set("userLoginInfo",response);
                loading.dismiss().then( ()=>{
                  if(this.navParams.get("cartData")){
                    this.navCtrl.push(CheckoutPage,{"cartData":this.navParams.get("cartData")});
                  }else{
                    this.navCtrl.popToRoot();
                    
                  }
                });
              }
            });
            
          },(err)=>{
            loading.dismiss().then( ()=>{              
              this.toastCtrl.create({
                message : err.json(),
                showCloseButton : true,
                closeButtonText : "OK"
              }).present();
            })
          });
      }
    },(err)=>{
      loading.dismiss().then( ()=>{              
        this.toastCtrl.create({
          message : err.json().error,
          showCloseButton : true,
          closeButtonText : "OK"
        }).present();
      })
    });
  } 
  signup(){
      this.navCtrl.push(SignupPage);
  } 

}
