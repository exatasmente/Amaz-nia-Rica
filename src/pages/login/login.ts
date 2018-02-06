import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage/dist/storage';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';

import { MyApp } from '../../app/app.component';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  authForm: FormGroup;
  constructor(public formBuilder: FormBuilder, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public http: Http, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {

    this.authForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });


  }
  onSubmit(value: any): void {
    if (this.authForm.valid) {
      console.log(value);
      this.login(value.username, value.password);
    }
  }

  login(username, password) {
    let loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loading.present();
    this.http.get("http://amazoniarica.store/api/api/user/generate_auth_cookie?insecure=cool&username=" + username + "&password=" + password).subscribe((data1) => {
      if (data1.json().status == "error") {
        loading.dismiss().then(() => {
          this.toastCtrl.create({
            message: "Nome de usuário ou email Inválido",
            showCloseButton: true,
            closeButtonText: "OK"
          }).present();

        });
      } else {
        this.http.get("http://amazoniarica.store/storeApi.php?opt=1&endpoint=customers/" + data1.json().user.id).subscribe(rep => {
          let response = rep.json();
          if (response.error) {
            loading.dismiss().then(() => {
              this.toastCtrl.create({
                message: response.error,
                showCloseButton: true,
                closeButtonText: "OK"
              }).present();
            });

          } else {
            //this.authProvider.login({email: response.email,senha : this.authForm.value.password});
            this.storage.set("userLogin", response);
            loading.dismiss().then(() => {
              if (this.navParams.get("cartData")) {
                this.navCtrl.push('CheckoutPage', { "cartData": this.navParams.get("cartData") });
              } else {
                this.navCtrl.popToRoot();

              }
            });
          }
        });
      }

    });




  }
  signup() {
    this.navCtrl.push('SignupPage');
  }

}
