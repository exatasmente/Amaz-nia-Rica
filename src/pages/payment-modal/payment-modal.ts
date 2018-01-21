import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NgZone } from '@angular/core';

declare var PagSeguroDirectPayment;

@Component({
  selector: 'page-payment-modal',
  templateUrl: 'payment-modal.html',
})
export class PaymentModalPage {
  paymentMethod: any;
  value : any;
  brand : any;
  parcelas : any[];
  parcela : any;
  constructor(public zone : NgZone , public storage : Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.paymentMethod = {};
    this.parcelas = [];
    this.parcela = false;
    this.value = this.navParams.get("total");
  }

  
  closeModal(){

    this.storage.set("CardData",this.paymentMethod).then ( ()=>{
      this.navCtrl.pop();
    });
    
  }

  getInstallments(){
    PagSeguroDirectPayment.getInstallments({
      amount: this.value,
      maxInstallmentNoInterest: 6,
      brand: this.brand,
      success: response=>{
        this.parcelas = [];
          this.zone.run( ()=>{
            response.installments[this.brand.toLowerCase()].forEach(element => {
              console.log(element);
              this.parcelas.push(element);
            });
            this.parcela = true;
          })
          

          
          
      }, 
      error: response =>{

      }
      
  });
  
  }
  getBrand(){
    
    PagSeguroDirectPayment.getBrand({
      cardBin: this.paymentMethod.cardNumber,
      success: response => {
        this.brand = response.brand.name;
        this.getInstallments();
      },
      error: response => {
        console.log(response);
      }
      
  });
  }

  monthChange(val: any) {

    this.paymentMethod.cardExpMonth = val;
  }

  yearChange(val: any) {
    
    this.paymentMethod.cardExpYear = val;
  }
  parcelasChange(val : any){
    this.paymentMethod.parcela = this.parcelas[parseInt(val)];
  }
  
}
