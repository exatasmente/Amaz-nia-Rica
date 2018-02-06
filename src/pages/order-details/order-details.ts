import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

import { WooProvider } from '../../providers/woo/woo';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@IonicPage()
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {
  order: any;
  atual: string = "Visão Geral";
  WooCommerce: any;
  products: any[];
  ready: any = false;
  pagsegurourl;
  pagseguro;
  constructor(public iab: InAppBrowser, public http: Http, public zone: NgZone, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public WC: WooProvider, public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.WooCommerce = this.WC.init()
    this.products = [];
    this.order = this.navParams.get("order");
    this.order.meta_data.forEach(meta => {
      if (meta.key == 'pagsegurourl') {
        this.pagsegurourl = meta.value;
      }
      if (meta.key == 'pagsegurocode') {
        this.http.get("http://amazoniarica.store/api.php?opt=getTransaction&code=" + meta.value).subscribe(rep => {
          this.pagseguro = rep.json();
        });
      }
    });
  }
  closeModal() {
    this.navCtrl.pop();
  }
  openSearch() {
    this.navCtrl.push('SearchPage');
  }
  openCart() {
    this.navCtrl.push('CartPage');
  }
  loadProducts() {
    let loading = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loading.present();
    try {
      for (let i = 0; i < this.order.line_items.length; i++) {
        this.WooCommerce.getAsync("products/" + this.order.line_items[i].product_id).then((data) => {
          loading.dismiss();
          this.zone.run(() => {
            let aux = JSON.parse(data.body);
            console.log(aux);
            this.products.push({
              image: aux.images[0].src,
              name: aux.title,
              price: aux.price,
              quantity: this.order.line_items[i].quantity

            });
            if (i + 1 == this.order.line_items.length) {

              this.ready = true;
            }
          })


        }, (err) => {
          loading.dismiss();
          this.toastCtrl.create({
            message: "Algo Insesperado aconteceu. Estamos trabalhando para corrigir",
            closeButtonText: "OK",
            showCloseButton: true
          }).present();
        })
      }
    } catch (e) {
      loading.dismiss();
      this.toastCtrl.create({
        message: "Algo Insesperado aconteceu. Estamos trabalhando para corrigir",
        closeButtonText: "OK",
        showCloseButton: true
      }).present();
    }
  }
  sellerContact() {
    this.navCtrl.push('SellerContactPage', { items: this.order.line_items });
  }

  getBoleto() {
    let browser = this.iab.create(this.pagsegurourl);
    browser.show();
  }
}
