import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Storage } from '@ionic/storage/dist/storage';

import { WooProvider } from '../../providers/woo/woo';
import { LoginPage } from '../login/login';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NgZone } from '@angular/core';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  user: FormGroup;
  atual: any = 'aba1';
  billing: FormGroup;
  shipping: FormGroup;
  WooCommerce: any;

  billing_shipping_same: boolean;
  valido: any = false;
  authForm : FormGroup;
  constructor(public zone: NgZone, public formBuilder: FormBuilder, public WC: WooProvider, public storage: Storage, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, public http: Http) {
    this.authForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required,Validators.minLength(8)])],
      password: ['', Validators.compose([Validators.required,Validators.minLength(8)])]
    });

    this.user = formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      cpf: ['', Validators.compose([Validators.required])],
      birthDate: ['', Validators.compose([Validators.required])],
      sex: ['', Validators.compose([Validators.required])]
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
    if(next == 'aba2'){
      
      
    
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
    }else if (next == 'aba3') {
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
      
      user.birthDate= user.birthDate.split('-').reverse().join('/');
      console.log(user);
      

      if(this.billing_shipping_same){
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
          "phone": "("+billing.ddd+")"+ billing.telefone
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
        "meta_data" : [
          {
            "key": "shipping_number",
            "value": shipping.numero
          },
          {
            "key":"shipping_neighborhood",
            "value": shipping.bairro
          },
          {
            "key": "number",
            "value" :billing.numero,
          },
          {
            "key": "neighborhood",
            "value": billing.bairro
          },
          {
            "key": "cpf",
            "value": user.cpf
          },
          {
            "key": "birthdate",
            "value": user.birthDate
          },
          {
            "key": "sex",
            "value": user.sex
          }]
      }
  
      let loading = this.loadingCtrl.create({
        content: "Aguarde..."
      });
      loading.present()
  
      this.http.get("http://paranoidlab.xyz/storeApi.php?opt=2&endpoint=customers&data=" + JSON.stringify(customer)).subscribe((data) => {
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
  
    
}
