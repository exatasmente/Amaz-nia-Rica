import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WooProvider } from '../../providers/woo/woo';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { OnInit } from '@angular/core';
import { NgZone } from '@angular/core';


@IonicPage()
@Component({
  selector: 'page-produtores-pop-over',
  templateUrl: 'produtores-pop-over.html',
})
export class ProdutoresPopOverPage implements OnInit {
  categories = [];
  categorias = [];
  subcategorias = [];
  sub: Map<number, any> = new Map<number, any>();
  WooCommerce;
  constructor(public zone: NgZone, public loadingCtrl: LoadingController, public WC: WooProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.WooCommerce = WC.init();

  }
  ngOnInit() {
    let loading = this.loadingCtrl.create({
      content: "Carregando Filtros",
      dismissOnPageChange: true
    });
    loading.present();
    this.sub.clear();
    this.categories = [];
    this.WooCommerce.getAsync("products/categories").then((data) => {
      this.zone.run(() => {

        try {
          let temp = JSON.parse(data.body);
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].parent == 0) {
              this.categories.push(temp[i]);
              if (!this.sub.get(temp[i].parent)) {
                this.sub.set(temp[i].id, []);
              }
            } else {
              if (this.sub.get(temp[i].parent)) {
                this.sub.get(temp[i].parent).push(temp[i]);
              } else {
                this.sub.set(temp[i].parent, []);
                this.sub.get(temp[i].parent).push(temp[i]);
              }
            }
          }
          loading.dismiss()
        } catch (e) {
          loading.dismiss();

        }
      });
    });
  }
  closePopOver(b){
    if(b){
      this.navCtrl.pop();
    }
  }

}
