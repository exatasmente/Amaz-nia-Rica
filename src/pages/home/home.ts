import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import * as WC from 'woocommerce-api';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ProductDetailsPage } from '../product-details/product-details';
import { ProductsbyCategoryPage } from '../productsby-category/productsby-category';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { CartPage } from '../cart/cart';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  opcao:string = "destaques";
  products: any[];
  moreProducts : any[];
  categories : any[];
  page :number;
  
  
  WooCommerce : any;
  constructor(public navCtrl: NavController, public loadingCrtl: LoadingController, public toastCtrl : ToastController, public modalCtrl : ModalController ) {
    this.WooCommerce = WC({
      url:"http://localhost/wordpress/",
      consumerKey:"ck_b1f1da1ef6a70e5eced146e4e43c56a42d2c127d",
      consumerSecret:"cs_da59e5f5927b0b63d44fcccbd41e02fa56f5d116"
      
    });
    
    this.page = 2;
    this.categories = [];
    let loading = this.loadingCrtl.create({content:'Carregando Produtos'});
    loading.present();
    
    this.WooCommerce.getAsync("products").then ( (data)=>{
        console.log(JSON.parse(data.body));
        this.products = JSON.parse(data.body).products;
        loading.dismiss();
    },(err)=>{
      console.log(err);
      loading.dismiss();
    });
    
    //this.loadCategories();
    this.loadMoreProducts(null);
  }
  
  loadCategories(){
    if(this.categories.length == 0){
      let loading = this.loadingCrtl.create({content:'Carregando Categorias'});
      loading.present();
      this.WooCommerce.getAsync("products/categories").then ( (data)=>{
        console.log(JSON.parse(data.body).product_categories);
        let temp : any[] = JSON.parse(data.body).product_categories;
        for(let i = 0 ; i < temp.length ; i++){
          if(temp[i].parent ==0 ){
            this.categories.push(temp[i]);
          }
        }
        loading.dismiss();
      },(err)=>{
        console.log(err);
        loading.dismiss();
      });
    }
  }
  loadMoreProducts(event){
    if(event == null){
      this.page = 2;
      this.moreProducts = [];
    }else{
      this.page++;
    }
    
    this.WooCommerce.getAsync("products?page="+this.page).then ( (data)=>{
      console.log(JSON.parse(data.body));
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);
      if(event != null){
        //event.complete();
        
        if(JSON.parse(data.body).products.length < 10){
          event.enable(false);
          this.toastCtrl.create({
            message:"Sem mais Produtos",
            duration:5000}).present();
        }
      }

      
  },(err)=>{
    console.log(err);
  });


  }
  openCategoryProductPage(category){
    this.navCtrl.push(ProductsbyCategoryPage,{'category':category});
  }
  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage,{product:product});
  }

  openCart(){
    this.modalCtrl.create(CartPage).present();
  }
  
}
