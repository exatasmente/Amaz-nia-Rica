import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage/dist/storage';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Http } from '@angular/http';

import xml2js from 'xml2js';
import { loadavg } from 'os';



@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  cartItens : any[] = [];
  total :any;
  emptyCart : any;
  cep: string;
  shipmentValue : any;
  shipmentDate : any;
    constructor(public http: Http, public toastCtrl : ToastController , public navCtrl: NavController, public navParams: NavParams, public storage : Storage, public loadingCtrl : LoadingController) {
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
    this.loadingCtrl.create({
      duration:500
    }).present().then( ()=>{
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
    
    });
  }
  calculateShipment(){
    
    this.shipmentValue = 0.0;
    let height :any = 0;
    let width : any = 0;
    let length: any = 0 ;
    let qts :any = 0 ;
    let loading = this.loadingCtrl.create({
      content:"Aguarde..."
    });
    loading.present();
    this.cartItens.forEach( item =>{
        height += item.height ? parseFloat(item.height)*item.qty : 0;
        width += item.width ? parseFloat(item.width)*item.qty : 0;
        height += item.length ? parseFloat(item.length)*item.qty : 0;
        qts += item.qty;
    });
    this.http.get("http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdServico=04510&nCdEmpresa&sDsSenha&sCepDestino="+
        this.cep+
        "&sCepOrigem=66065310&nVlAltura="
        +(height >= 2 ? height : 2)+
        "&nVlLargura="+(width >= 11 ? width : 11)+
        "&nVlDiametro=0"+
        "&nVlComprimento="+(length > 16 ? length : 16)+
        "&nVlPeso="+"0"+
        "&nCdFormato=1&sCdMaoPropria=N&nVlValorDeclarado=75&sCdAvisoRecebimento=S&StrRetorno=xml").
        subscribe((data) => {
          
          xml2js.parseString(data.text(),(err,jsondata)=>{
            try{
              let response = (JSON.parse(JSON.stringify(jsondata))['Servicos'].cServico[0]);
              console.log(response);
              if(response['Erro'][0] == "0"){
                loading.dismiss();
                this.shipmentValue = parseFloat(response['Valor'][0]);
                this.shipmentDate = response['PrazoEntrega'][0];
                this.total += this.shipmentValue;
              }else{
                loading.dismiss();
                this.toastCtrl.create({
                  message:"Algo inesperado aconteceu, Estamos Tentando Resolver",
                  closeButtonText: "Ok",
                  showCloseButton: true
                }).present();
              }
            }catch(e){
              loading.dismiss();
                this.toastCtrl.create({
                  message:"Algo inesperado aconteceu, Estamos Tentando Resolver",
                  closeButtonText: "Ok",
                  showCloseButton: true
                }).present();
            }
          });
          
        },(error) => {
          loading.dismiss();
                this.toastCtrl.create({
                  message:"Algo inesperado aconteceu, Estamos Tentando Resolver",
                  closeButtonText: "Ok",
                  showCloseButton: true
                }).present();
        
      });
      
  }

}