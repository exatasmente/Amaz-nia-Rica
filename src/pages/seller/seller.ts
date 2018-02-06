import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChangeDetectorRef } from '@angular/core';
import { WooProvider } from '../../providers/woo/woo';
import { NgZone } from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-seller',
  templateUrl: 'seller.html',
})
export class SellerPage {

  showToolbar: boolean = false;
  seller;
  sellerProducts = [];
  products: Map<number, number> = new Map<number, number>();
  WooCommerce;
  constructor(public navCtrl: NavController, public zone: NgZone, public WC: WooProvider, navParams: NavParams, public ref: ChangeDetectorRef) {
    this.seller = navParams.data.seller;
    this.WooCommerce = WC.init();
    let aux = [];
    this.seller.meta_data.forEach(meta => {
      if (meta.key == "products") {

        JSON.parse(meta.value).forEach(prod => {
          if (!this.products.get(prod)) {
            this.products.set(prod, prod);
            aux.push(prod);
          }
        });
      }
    });
    for (let i = 0; i < aux.length; i++) {
      this.WooCommerce.getAsync('products/' + aux[i]).then(data => {
        let p = JSON.parse(data.body);
        this.zone.run(() => {
          if (p.id) {
            this.sellerProducts.push(p);
          }


        });
      }, err => {
        console.log(err);
      });

    }


  }

  onScroll($event: any) {
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 100;
    this.ref.detectChanges();
  }
  openProductPage(product) {
    this.navCtrl.push('ProductDetailsPage', { product: product });
  }
}