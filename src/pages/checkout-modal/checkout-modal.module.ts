import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutModalPage } from './checkout-modal';

@NgModule({
  declarations: [
    CheckoutModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckoutModalPage),
  ],
})
export class CheckoutModalPageModule {}
