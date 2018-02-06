import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WooProvider } from '../../providers/woo/woo';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  busca: string;
  WooCommerce;
  products = [];
  
  page = 1;
  constructor(public WC: WooProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.WooCommerce = this.WC.init();
  }

  buscar(event) {
    if(this.busca == '')
      return;

    
    this.WooCommerce.getAsync("products?filter[q]=" + this.busca).then((searchData) => {
      this.products = JSON.parse(searchData.body);
    });
  }

  loadMoreProducts(event) {
    console.log("carrega Mais");
    this.page++;
    

    this.WooCommerce.getAsync("products?filter[q]="+this.busca+"&page="+ this.page).then((data) => {
      try {
        this.products = this.products.concat(JSON.parse(data.body));
        if (event != null) {
          event.complete();
          if (JSON.parse(data.body).products.length < 10) {
            event.enable(false);

          }
        }

        }catch (e) {
          event.complete();
        }

      }, (err) => {
        console.log(err);
      });


  }
  openProductPage(product){
    this.navCtrl.push('ProductDetailsPage',{product:product});
    
  } 

}
