import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams } from 'ionic-angular';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Storage } from '@ionic/storage/dist/storage';

import { WooProvider } from '../../providers/woo/woo';

import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NgZone } from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  user: FormGroup;
  empresa;
  cnpj;
  company = false;
  atual: any = 'aba1';
  billing: FormGroup;
  shipping: FormGroup;
  WooCommerce: any;
  billing_shipping_same: boolean;
  valido: any = false;
  authForm: FormGroup;
  constructor(public zone: NgZone, public formBuilder: FormBuilder, public WC: WooProvider, public storage: Storage, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, public http: Http) {
    this.authForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });

    this.user = formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      cpf: ['', Validators.compose([Validators.required])],
      birthDate: ['', Validators.compose([Validators.required])],
      sex: ['', Validators.compose([Validators.required])],
    });
    this.billing = formBuilder.group({
      rua: ['', Validators.compose([Validators.required])],
      numero: ['', Validators.compose([Validators.required])],
      complemento: ['', Validators.compose([Validators.required])],
      pais: ['', Validators.compose([Validators.required])],
      estado: ['', Validators.compose([Validators.required])],
      cidade: ['', Validators.compose([Validators.required])],
      bairro: ['', Validators.compose([Validators.required])],
      cep: ['', Validators.compose([Validators.required])],
      ddd: ['', Validators.compose([Validators.required])],
      telefone: ['', Validators.compose([Validators.required])]
    });
    this.shipping = formBuilder.group({
      rua: ['', Validators.compose([Validators.required])],
      numero: ['', Validators.compose([Validators.required])],
      complemento: ['', Validators.compose([Validators.required])],
      pais: ['', Validators.compose([Validators.required])],
      estado: ['', Validators.compose([Validators.required])],
      cidade: ['', Validators.compose([Validators.required])],
      bairro: ['', Validators.compose([Validators.required])],
      cep: ['', Validators.compose([Validators.required])],
      ddd: ['', Validators.compose([Validators.required])],
      telefone: ['', Validators.compose([Validators.required])]
    });

    this.billing_shipping_same = false;


    this.WooCommerce = this.WC.init();
  }
  prosseguir(next) {
    if (next == 'aba2') {



      if (this.user.valid) {
        this.atual = next;
      } else {
        this.toastCtrl.create({
          message: "Verifique todos os campos e preençha corretamente",
          showCloseButton: true,
          closeButtonText: "OK",
          duration: 2000
        }).present();
      }
    } else if (next == 'aba3') {
      console.log(this.valid());
      if (this.valid()) {
        this.atual = next;
      } else {
        this.toastCtrl.create({
          message: "Verifique todos os campos e preençha corretamente",
          showCloseButton: true,
          closeButtonText: "OK",
          duration: 2000
        }).present();
      }


    }


  }
  valid() {
    if (this.billing_shipping_same) {

      return this.billing.valid;
    } else {

      return (this.billing.valid && this.shipping.valid);
    }
  }

  signup() {
    let user = this.user.value;
    let auth = this.authForm.value;
    let billing = this.billing.value;
    let shipping = this.shipping.value;

    user.birthDate = user.birthDate.split('-').reverse().join('/');
    console.log(user);


    if (this.billing_shipping_same) {
      shipping = billing;
    }
    let customer = {
      "email": user.email,
      "first_name": user.firstName,
      "last_name": user.lastName,
      "username": auth.username,
      "password": auth.password,
      "billing": {
        "first_name": user.firstName,
        "last_name": user.lastName,
        "address_1": billing.rua,
        "address_2": billing.complemento,
        "city": billing.cidade,
        "state": billing.estado,
        "postcode": billing.cep,
        "country": billing.pais,
        "email": user.email,
        "phone": "(" + billing.ddd + ")" + billing.telefone
      },
      "shipping": {
        "first_name": user.firstName,
        "last_name": user.lastName,
        "address_1": shipping.rua,
        "address_2": shipping.complemento,
        "city": shipping.cidade,
        "state": shipping.estado,
        "postcode": shipping.cep,
        "country": shipping.pais,

      },
      "meta_data": [
        {
          "key": "shipping_number",
          "value": shipping.numero
        },
        {
          "key": "shipping_neighborhood",
          "value": shipping.bairro
        },
        {
          "key": "billing_number",
          "value": billing.numero,
        },
        {
          "key": "billing_neighborhood",
          "value": billing.bairro
        },
        {
          "key": "billing_cpf",
          "value": user.cpf
        },
        {
          "key": "billing_birthdate",
          "value": user.birthDate
        },
        {
          "key": "billing_sex",
          "value": user.sex
        },
        {
          "key": "role",
          "value": "customer"
        }]
    }
    if(this.company){
      customer.meta_data.push(
        {
          "key": "billing_cnpj",
          "value": this.cnpj
        },
        {
          "key": "billing_company",
          "value": this.empresa
        });
    }
    let loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loading.present()
    try{
      this.http.get("http://amazoniarica.store/storeApi.php?opt=2&endpoint=customers&data=" + JSON.stringify(customer)).subscribe((data) => {
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
                } else {
                  this.navCtrl.push('LoginPage', { "cartData": this.navParams.get("cartData") });
                }
              }
            }]
          }).present();
        }
      });
    }catch(e){
      this.toastCtrl.create({
        message: "Algo de errado aconteçeu, verifique sua Internet",
        dismissOnPageChange: true,
        showCloseButton: true,
        closeButtonText: "OK",
        duration: 2000
      }).present()
    }
  }
  emailCheck() {
    let validEmail = false;

    let reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (reg.test(this.user.value.email)) {
      this.WooCommerce.getAsync("customers/email/" + this.user.value.email).then((data => {
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
  pegaEndereco(i) {
    if (i == '1') {
      if (!this.billing.controls.cep.hasError('minLength')) {
        this.http.get('http://api.postmon.com.br/v1/cep/' + this.billing.value.cep).subscribe(data => {
          let resp = data.json();
          let bill = this.billing.value;
          bill.rua = resp.logradouro || '';
          bill.cidade = resp.cidade || '';
          bill.bairro = resp.bairro || '';
          bill.estado = resp.estado;
          bill.pais = 'BR' || '';
          this.billing.setValue(bill);

        }, (err => {
          console.log(err);
        }));
      } else {
        this.toastCtrl.create({
          message: "verifique o CEP digitado",
          duration: 3000,
          dismissOnPageChange: true
        }).present();
      }
    } else {
      if (!this.shipping.controls.cep.hasError('minLength')) {
        this.http.get('http://api.postmon.com.br/v1/cep/' + this.shipping.value.cep).subscribe(data => {
          let resp = data.json();
          let bill = this.shipping.value;
          bill.rua = resp.logradouro || '';
          bill.cidade = resp.cidade || '';
          bill.bairro = resp.bairro || '';
          bill.estado = resp.estado;
          bill.pais = 'BR' || '';
          this.shipping.setValue(bill);

        }, (err => {
          console.log(err);
        }));
      } else {
        this.toastCtrl.create({
          message: "verifique o CEP digitado",
          duration: 3000,
          dismissOnPageChange: true
        }).present();
      }
    }
  }

}
