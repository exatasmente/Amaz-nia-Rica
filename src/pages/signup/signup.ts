import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Storage } from '@ionic/storage/dist/storage';
import { MenuPage } from '../menu/menu';
import { WooProvider } from '../../providers/woo/woo';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  newUser :any = {

  };

  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  pureResult: any;
  maskedId: any;
  val: any;
  v: any;

  WooCommerce : any;

  billing_shipping_same: boolean;

  constructor(public WC : WooProvider ,public storage : Storage, public loadingCtrl : LoadingController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, public http : Http) {

    this.newUser.billing_address = {};
    this.newUser.shipping_address = {};
    this.billing_shipping_same = false; 

    this.newUser.cpf = "";

    this.WooCommerce = this.WC.init();
  }

  setBillingToShipping(){
    this.billing_shipping_same = true;
  }
  signup(){

    if(this.billing_shipping_same){
      this.newUser.shipping_address = this.newUser.billing_address;
    }
    let loading = this.loadingCtrl.create({
      content:"Aguarde.."
    })
    loading.present();
    this.http.get("http://amazoniaricaapi2.000webhostapp.com/api/get_nonce/?controller=user&method=register").subscribe( (data=>{
      let d1 = JSON.parse(JSON.stringify(data))._body;
      let nonce = JSON.parse(d1).nonce;
      if(nonce != null){
        this.http.get("https://amazoniaricaapi2.000webhostapp.com/api/user/register/?username="+
        this.newUser.email+
        "&nonce="+nonce+
        "&email="+this.newUser.email+
        "&display_name="+this.newUser.first_name+
        "&first_name="+this.newUser.first_name+
        "&last_name="+this.newUser.last_name+
        "&user_pass="+this.newUser.password+
        "&notify=both&seconds=100").subscribe( (data2=>{
          let d = JSON.parse(JSON.stringify(data2))._body;
          let resp = JSON.parse(d);
          if(resp.status == "ok"){
              let cookie = resp.cookie;
              this.http.get("https://amazoniaricaapi2.000webhostapp.com/api/user/update_user_meta_vars/?cookie="+cookie+
              "&billing_first_name="+this.newUser.billing_address.first_name+
              "&billing_last_name="+this.newUser.billing_address.last_name+
              "&billing_address_1="+this.newUser.billing_address.address_1+
              "&billing_address_2="+this.newUser.billing_address.address_2+
              "&billing_city="+this.newUser.billing_address.city+
              "&billing_postcode="+this.newUser.billing_address.postcode+
              "&billing_country="+this.newUser.billing_address.country+
              "&billing_state="+this.newUser.billing_address.state+
              "&billing_phone="+this.newUser.billing_address.phone+
              "&billing_email="+this.newUser.billing_address.email+
              "&shipping_first_name="+this.newUser.first_name+
              "&shipping_last_name="+this.newUser.last_name+
              "&shipping_address_1="+this.newUser.shipping_address.address_1+
              "&shipping_address_2="+this.newUser.shipping_address.address_2+
              "&shipping_city="+this.newUser.shipping_address.city+
              "&shipping_postcode="+this.newUser.shipping_address.postcode+
              "&shipping_country="+this.newUser.shipping_address.country+
              "&shipping_state="+this.newUser.shipping_address.state
            ).subscribe( data3 =>{
              let d3 = JSON.parse(JSON.stringify(data3))._body;
              let resp2 = JSON.parse(d3);
              if(resp2.status == "ok"){
                  loading.dismiss().then(()=>{
                    this.http.get("http://amazoniaricaapi2.000webhostapp.com/api/get_nonce/?controller=user&method=generate_auth_cookie").subscribe( (data4)=>{
                      let nonce2 = data4.json().nonce;

                      if(nonce2 != null){
                          this.http.get("https://amazoniaricaapi2.000webhostapp.com/api/user/generate_auth_cookie/?username="+this.newUser.email+"&password="+this.newUser.password).subscribe( (data5)=>{
                            let response = data5.json();
                            this.storage.set("userLoginInfo",response);
                          })
                      }
                    })


                    this.alertCtrl.create({
                      title: "Conta Criada",
                      message: "Conta criada com sucesso!",
                      buttons: [{
                        text: "Ok",
                        handler: ()=> {
                          this.navCtrl.setRoot(MenuPage);
                        }
                      }]
                    }).present();
                  });
              }
            })
          }else{
            loading.dismiss();
            this.toastCtrl.create({
              message: resp.error,
              showCloseButton: true,
              closeButtonText : "OK"
              
            }).present();
          }

        }),(err=>{
          loading.dismiss();
            this.toastCtrl.create({
              message: err.json().error,
              showCloseButton: true,
              closeButtonText : "OK"
              
            }).present();
          console.log(err);
        }));

      }
      
    }),(err=>{
      loading.dismiss();
            this.toastCtrl.create({
              message: err.json().error,
              showCloseButton: true,
              closeButtonText : "OK"
              
            }).present();
      console.log(err);
    }))
    

  }

  emailCheck(){
    let validEmail= false;
    let reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(reg.test(this.newUser.email)){
      this.WooCommerce.getAsync("customers/email/"+this.newUser.email).then( (data =>{
        let res = JSON.parse(data.body);
        console.log(res);
        if(res.errors){
          validEmail = true;

        }else{
          validEmail = false;

          this.toastCtrl.create({
            message : "Email Já Cadastrado",
            showCloseButton : true,
            closeButtonText:"OK"

          }).present()
        }
      }));


    }else{

      this.toastCtrl.create({
        message : "Email Inválido",
        showCloseButton : true,
        closeButtonText:"OK"
      }).present()
    }
  }

  format(valString) {
    if (!valString) {
        return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    this.pureResult = parts;
    if(parts[0].length <= 11){
      this.maskedId = this.cpf_mask(parts[0]);
      return this.maskedId;
    }
};

unFormat(val) {
    if (!val) {
        return '';
    }
    val = val.replace(/\D/g, '');

    if (this.GROUP_SEPARATOR === ',') {
        return val.replace(/,/g, '');
    } else {
        return val.replace(/\./g, '');
    }
};

 cpf_mask(v) {
    v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
    return v;
}

}
