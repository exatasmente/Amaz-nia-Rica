import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NgZone } from '@angular/core';
import { Http } from '@angular/http';
import {AuthProvider} from '../../providers/auth/auth';
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  user: FormGroup;
  authForm: FormGroup;
  billing: FormGroup;
  atual: any = 'aba1';
  valido: any = false;
  
  constructor(public authApi : AuthProvider, public http: Http,public zone: NgZone, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController) {
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
      cep: ['', Validators.compose([Validators.required])]
    });
    
    
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
      return this.billing.valid;
  }

  signup() {
    let user = this.user.value;
    let auth = this.authForm.value;
    let billing = this.billing.value;

    user.birthDate = user.birthDate.split('-').reverse().join('/');
    console.log(user);

    let customer = {
      "email": user.email,
      "nome": user.firstName,
      "sobrenome": user.lastName,
      "login": auth.username,
      "senha": auth.password,
      "endereco": {
        "logadouro": billing.rua,
        "complemento": billing.complemento,
        "ciadade": billing.cidade,
        "estado": billing.estado,
        "cep": billing.cep,
        "pais": billing.pais,
      }
    }
    let loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loading.present()

      
  }
  emailCheck() {
    let validEmail = false;

    let reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (reg.test(this.user.value.email)) {
      this.authApi.getEmail(this.user.value.email).then((data => {
        let res = JSON.parse(data.body);
        console.log(res);
        if (res.status == 404) {
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
    }
    
  }

}
