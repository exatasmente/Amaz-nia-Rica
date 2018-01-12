import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage/dist/storage';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { MenuPage } from '../menu/menu';
import { SignupPage } from '../signup/signup';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


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
    this.http.get("http://amazoniaricaapi2.000webhostapp.com/api/get_nonce/?controller=user&method=generate_auth_cookie").subscribe( (data)=>{
      let nonce = data.json().nonce;
      if(nonce != null){
          this.http.get("https://amazoniaricaapi2.000webhostapp.com/api/user/generate_auth_cookie/?username="+this.username +"&password="+this.password).subscribe( (data1)=>{
            let response = data1.json();
            
            if(response.error){
              loading.dismiss().then( ()=>{              
                this.toastCtrl.create({
                  message : response.error,
                  showCloseButton : true,
                  closeButtonText : "OK"
                }).present();
              })

            }else{
              console.log(response);
              this.storage.set("userLoginInfo",response);
              loading.dismiss().then( ()=>{

                if(!this.navParams.get("next")){
                  this.navCtrl.pop();
                }else{
                  this.navCtrl.push(this.navParams.get("next"));
                }
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
