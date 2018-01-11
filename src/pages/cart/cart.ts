import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage/dist/storage';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';



@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  cartItens : any[] = [];
  total :any;
  emptyCart : any;
    constructor(public toastCtrl : ToastController , public navCtrl: NavController, public navParams: NavParams, public storage : Storage) {
      this.total = 0;
      
      this.storage.ready().then( ()=>{
          this.storage.get("cart").then( (data=>{
            if(data != null){
              this.cartItens = data;
              
              if(this.cartItens.length > 0){
                this.cartItens.forEach( (item,index) =>{
                    this.total = this.total + (item.product.price * item.qty);
                })
              }else{
                this.emptyCart = true;
              }
            }else{
              this.cartItens= [];
              this.emptyCart = true;
            }
          }),(err =>{
              console.log(err);
          }))
      })
  }

  closeModal(){
    this.navCtrl.pop();
  }

  decrementQty(item,i){
    
    let qty = item.qty;
    if(qty-1 > 0){
      this.cartItens[i].qty = qty-1;

      this.cartItens[i].amount = parseFloat(this.cartItens[i].amount) - parseFloat(this.cartItens[i].product.price);
      this.total -= parseFloat(this.cartItens[i].product.price);
    }


  }
  incrementQty(item,i){
    let qty = item.qty;
    if(qty+1 < 10){
      this.cartItens[i].qty = qty+1;

      this.cartItens[i].amount = parseFloat(this.cartItens[i].amount) + parseFloat(this.cartItens[i].product.price);
      this.total += parseFloat(this.cartItens[i].product.price);
    }

  }
  removeFromCart(item,i){
    let price = item.product.price;
    let qty = item.qty;

    this.cartItens.splice(i,1);

    this.storage.set("cart",this.cartItens).then(  ()=>{
      this.total = this.total - (price*qty);

      this.toastCtrl.create({
        message:"Produto Removido",
        duration: 2000,
        position:"top"
      }).present();

    });
    if(this.cartItens.length == 0){
      this.emptyCart = true;
    }
  }
}
