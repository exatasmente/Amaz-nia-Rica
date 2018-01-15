import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  constructor(public http : Http, public navCtrl: NavController, public navParams: NavParams) {
    //http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdServico=04510&nCdEmpresa&sDsSenha&sCepDestino=66065310&sCepOrigem=66065310&nVlAltura=2&nVlLargura=11&nVlDiametro=0&nVlComprimento=16&nVlPeso=0&nCdFormato=1&sCdMaoPropria=N&nVlValorDeclarado=75&sCdAvisoRecebimento=S&StrRetorno=xml
  }

  
}
