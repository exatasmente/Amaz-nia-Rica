import { Component } from '@angular/core';
import {IonicPage,NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { WooProvider } from '../../providers/woo/woo';


import { ModalController } from 'ionic-angular/components/modal/modal-controller';
@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {
  categories : any[]
  WooCommerce : any;
  sub : Map<any,any> = new  Map<any,any>();
  
  constructor(public WC : WooProvider, public navCtrl: NavController, public navParams: NavParams,public loadingCtrl : LoadingController, public modalCtrl : ModalController) {
    if(this.navParams.get("sub")){
      
      this.categories  = this.navParams.get("sub");
    }else{
      this.WooCommerce = this.WC.init();
      this.categories = [];
      let loading = this.loadingCtrl.create({content:'Carregando Categorias'});
      loading.present();
      this.WooCommerce.getAsync("products/categories").then ( (data)=>{
        console.log(JSON.parse(data.body));
        let temp : any[] = JSON.parse(data.body);
        for(let i = 0 ; i < temp.length ; i++){
          if(temp[i].parent ==0 ){
            this.categories.push(temp[i]);
            this.sub.set(temp[i].id,[]);
          }else{
            if(this.sub.get(temp[i].parent)){
              this.sub.get(temp[i].parent).push(temp[i]);
            }else{
              this.sub.set(temp[i].parent,[]);
              this.sub.get(temp[i].parent).push(temp[i]);
            }
            
          }
        }
        console.log(this.sub);
        loading.dismiss();
      },(err)=>{
        console.log(err);
        loading.dismiss();
      });
    }
  }
  openCategoryProductPage(category){
    if(this.sub.get(category.id) && this.sub.get(category.id).length){
      this.navCtrl.push('CategoriasPage',{'sub':this.sub.get(category.id)});  
    }else{
      this.navCtrl.push('ProductsbyCategoryPage',{'category':category});
    }
    
  }
  openSearch(){
    this.navCtrl.push('SearchPage');
  }
  openCart(){
    this.navCtrl.push('CartPage');   
  } 
  swipe(event) {
    if(event.direction === 2) {
      this.navCtrl.parent.select(2);
    }
    if(event.direction === 4) {
      this.navCtrl.parent.select(0);
    }
  }
}
