import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WooProvider } from '../../providers/woo/woo';
import { PopoverController } from 'ionic-angular';
import { NgZone } from '@angular/core';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@IonicPage()
@Component({
  selector: 'page-produtores',
  templateUrl: 'produtores.html',
})
export class ProdutoresPage {
  busca: string;
  WooCommerce;
  sellers = [];

  page = 1;
  constructor(public loadingCtrl : LoadingController,public zone: NgZone, public popOverCtrl: PopoverController, public WC: WooProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.WooCommerce = this.WC.init();
    this.zone.run(() => {
      let loading = this.loadingCtrl.create({
        content:"Carregando...",
        duration:10000
      });
      loading.present();
      this.WooCommerce.getAsync("customers?role=author&per_page=20").then((searchData) => {
       
        JSON.parse(searchData.body).forEach(seller => {
          let aux = seller;
          aux.image =  this.getImage(seller);
          this.sellers.push(aux)  
        });
        loading.dismiss();
      },err=>{
        loading.dismiss();
      });

    });
  }
  openSellerPage(seller) {
    this.navCtrl.push("SellerPage", { seller: seller });
  }
  buscar(event) {
    if (this.busca == '') {
      this.sellers = [];
      this.zone.run(() => {

        this.WooCommerce.getAsync("customers?role=author&per_page=20").then((searchData) => {
          this.sellers = this.sellers.concat(JSON.parse(searchData.body));
        });
      });
    } else if (this.busca.length > 3) {



      this.WooCommerce.getAsync("customers?search=" + this.busca + "&per_page=20&role=author").then((searchData) => {
        this.sellers = JSON.parse(searchData.body);
      });
    }
  }

  loadMoreProducts(event) {
    console.log("carrega Mais");
    this.page++;


    this.WooCommerce.getAsync("customers?search=" + this.busca + "&per_page=20&page=" + this.page).then((data) => {
      try {
        this.sellers = this.sellers.concat(JSON.parse(data.body));
        if (event != null) {
          event.complete();
          if (JSON.parse(data.body).products.length < 10) {
            event.enable(false);

          }
        }

      } catch (e) {
        event.complete();
      }

    }, (err) => {
      console.log(err);
    });


  }
  openProductPage(product) {
    this.navCtrl.push('ProductDetailsPage', { product: product });

  }
  openPopOver(event) {
    let popover = this.popOverCtrl.create('ProdutoresPopOverPage');
    popover.present();
  }
  swipe(event) {
    if(event.direction === 4) {
      this.navCtrl.parent.select(1);
    }
  }
  getImage(seller){

    for(let i = 0 ; i < seller.meta_data.length ; i++){
      if(seller.meta_data[i].key=='company_image'){
        console.log(seller.meta_data[i]);  
        return seller.meta_data[i].value;
      }
    }
  }
}
