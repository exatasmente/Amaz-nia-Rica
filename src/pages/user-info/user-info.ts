import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

import { ModalController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
})


export class UserInfoPage implements OnInit {
  user: FormGroup;
  atual: any = 'aba1';
  billing: FormGroup;
  shipping: FormGroup;
  valido: any = false;
  authForm: FormGroup;
  empresa;
  cnpj;
  company = false;
  userId;
  billing_shipping_same = false;
  constructor(public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public alertCtrl: AlertController,
    public http: Http) {
    this.billing = this.formBuilder.group({
      rua: ['', Validators.compose([Validators.required])],
      numero: ['', Validators.compose([Validators.required])],
      complemento: ['', Validators.compose([Validators.required])],
      pais: ['', Validators.compose([Validators.required])],
      estado: ['', Validators.compose([Validators.required])],
      cidade: ['', Validators.compose([Validators.required])],
      bairro: ['', Validators.compose([Validators.required])],
      cep: ['', Validators.compose([Validators.required, Validators.maxLength(8), Validators.minLength(8)])],
      ddd: ['', Validators.compose([Validators.required])],
      telefone: ['', Validators.compose([Validators.required])]
    });
    this.user = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      cpf: ['', Validators.compose([Validators.required])],
      birthDate: ['', Validators.compose([Validators.required])],
      sex: ['', Validators.compose([Validators.required])]
    });

    this.shipping = this.formBuilder.group({
      rua: ['', Validators.compose([Validators.required])],
      numero: ['', Validators.compose([Validators.required])],
      complemento: ['', Validators.compose([Validators.required])],
      pais: ['', Validators.compose([Validators.required])],
      estado: ['', Validators.compose([Validators.required])],
      cidade: ['', Validators.compose([Validators.required])],
      bairro: ['', Validators.compose([Validators.required])],
      cep: ['', Validators.compose([Validators.required, Validators.maxLength(8), Validators.minLength(8)])]
    });


  }

  ngOnInit(): any {
    this.storage.get("userLogin").then(userData => {
      let billing = this.billing.value;
      let shipping = this.shipping.value;
      let user = this.user.value;
      this.userId = userData.id;
      billing.rua = userData.billing.address_1;
      billing.complemento = userData.billing.address_2;
      billing.cidade = userData.billing.city;
      billing.pais = userData.billing.country;
      billing.bairro = userData.billing.neighborhood;
      billing.estado = userData.billing.state;
      billing.numero = userData.billing.number;
      billing.cep = userData.billing.postcode;
      billing.ddd = userData.billing.phone.split(')')[0].replace('(', '');
      billing.telefone = userData.billing.phone.split(')')[1];

      shipping.rua = userData.shipping.address_1;
      shipping.complemento = userData.shipping.address_2;
      shipping.cidade = userData.shipping.city;
      shipping.pais = userData.shipping.country;
      shipping.bairro = userData.shipping.neighborhood;
      shipping.estado = userData.shipping.state;
      shipping.numero = userData.shipping.number;
      shipping.cep = userData.shipping.postcode;


      user.firstName = userData.first_name;
      user.lastName = userData.billing.last_name
      user.email = userData.email;
      user.cpf = userData.billing.cpf;
      user.birthDate = userData.meta_data[8].value.split('/').reverse().join('-');
      user.sex = userData.billing.sex;


      if (userData.billing.cnpj != '') {
        this.cnpj = userData.billing.cnpj;
        this.empresa = userData.billing.company;
        this.company = true;
      }
      this.billing.setValue(billing);
      this.shipping.setValue(shipping);
      this.user.setValue(user);
    });
  }
  atualizar() {
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
    if (this.company) {
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
    try {
      let loading = this.loadingCtrl.create({
        content: "Atualizando..."
      })
      loading.present();
      this.http.get('http://amazoniarica.store/storeApi.php?opt=3&endpoint=customers/' + this.userId + '&data=' + JSON.stringify(customer)).subscribe(resp => {
        loading.dismiss();
        if (resp.json().id == this.userId) {
          this.alertCtrl.create({
            message: "Cadastro Atualizado",
            title: "Sucesso!",
            subTitle: "Atualização de Cadastro",
            buttons: [{
              text: "Ok",
              handler: () => {
                this.http.get("http://amazoniarica.store/storeApi.php?opt=1&endpoint=customers/" + this.userId).subscribe(rep => {
                  this.storage.set("userLogin", rep.json());
                });
              }
            }]
          })
        }
      });
    } catch (e) {
      this.toastCtrl.create({
        message: "Algo de errado aconteçeu, verifique sua Internet",
        dismissOnPageChange: true,
        showCloseButton: true,
        closeButtonText: "OK",
        duration: 2000
      }).present()
    }
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
}
