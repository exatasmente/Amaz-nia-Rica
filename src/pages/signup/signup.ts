import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Storage } from '@ionic/storage/dist/storage';

import { WooProvider } from '../../providers/woo/woo';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  newUser: any = {

  };
  atual: any = 'aba1';
  DECIMAL_SEPARATOR = ".";
  GROUP_SEPARATOR = ",";
  pureResult: any;
  maskedId: any;
  val: any;
  v: any;

  WooCommerce: any;

  billing_shipping_same: boolean;

  constructor(public WC: WooProvider, public storage: Storage, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, public http: Http) {

    this.newUser.billing = {};
    this.newUser.billing.phone = {};
    this.newUser.shipping = {};
    this.newUser.shipping.phone = {};
    this.newUser.user = {};
    this.newUser.user.sex = "M";
    this.newUser
    this.billing_shipping_same = false;


    this.WooCommerce = this.WC.init();
  }

  setBillingToShipping() {
    if (this.billing_shipping_same) {
      this.newUser.shipping  = this.newUser.billing;
      this.newUser.shipping.phone = this.newUser.billing.phone;
    }
  }


  
  signup() {
    let customer = {
      "email": this.newUser.user.email,
      "first_name": this.newUser.user.firstName,
      "last_name": this.newUser.user.lastName,
      "username": this.newUser.user.userName,
      "password": this.newUser.user.password,
      "billing": {
        "first_name": this.newUser.user.firstName,
        "last_name": this.newUser.lastName,
        "address_1": this.newUser.billing.rua,
        "address_2": this.newUser.billing.complemento,
        "city": this.newUser.billing.cidade,
        "state": this.newUser.billing.estado,
        "postcode": this.newUser.billing.cep,
        "country": this.newUser.billing.pais,
        "email": this.newUser.user.email,
        "phone": "("+this.newUser.billing.phone.area+")"+ this.newUser.billing.phone.number,
        "number": this.newUser.billing.numero,
        "neighborhood": this.newUser.billing.bairro,
        "persontype": "F",
        "cpf": this.newUser.user.cpf,
        "birthdate": this.newUser.user.birthDate,
        "sex": this.newUser.user.sex,
      },
      "shipping": {
        "first_name": this.newUser.user.firstName,
        "last_name": this.newUser.user.lastName,
        "address_1": this.newUser.shipping.rua,
        "address_2": this.newUser.shipping.complemento,
        "city": this.newUser.shipping.cidade,
        "state": this.newUser.shipping.estado,
        "postcode": this.newUser.shipping.cep,
        "country": this.newUser.shipping.pais,
        "number": this.newUser.shipping.numero,
        "neighborhood": this.newUser.shipping.bairro,
      }
    }

    let loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loading.present()

    this.http.get("http://localhost:8100/storeApi?opt=2&endpoint=customers&data=" + JSON.stringify(customer)).subscribe((data) => {
      loading.dismiss();
      let rep = data.json();

      if (rep.error) {
        this.toastCtrl.create({
          message: rep.error,
          dismissOnPageChange: true,
          showCloseButton: true,
          closeButtonText: "OK",
          duration: 2000

        }).present()
      } else {
        this.alertCtrl.create({
          title: "Sucesso",
          message: "Sua Conta foi Criada com Sucesso",
          buttons: [{
            text: "Login",
            handler: () => {
              if (this.navCtrl.getPrevious().component.name == "LoginPage") {
                this.navCtrl.pop();
              }else{
                this.navCtrl.push(LoginPage,{"cartData":this.navParams.get("cartData")});
              }
            }
          }]
        }).present();
      }

    });

  }
  getDate(val: any) {
    console.log(val);
    this.newUser.user.birthDate = val._text;
  }

  emailCheck() {
    let validEmail = false;
    let reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (reg.test(this.newUser.email)) {
      this.WooCommerce.getAsync("customers/email/" + this.newUser.user.email).then((data => {
        let res = JSON.parse(data.body);
        console.log(res);
        if (res.errors) {
          validEmail = true;

        } else {
          validEmail = false;

          this.toastCtrl.create({
            message: "Email Já Cadastrado",
            showCloseButton: true,
            closeButtonText: "OK"

          }).present()
        }
      }));


    } else {

      this.toastCtrl.create({
        message: "Email Inválido",
        showCloseButton: true,
        closeButtonText: "OK"
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
    if (parts[0].length <= 11) {
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
