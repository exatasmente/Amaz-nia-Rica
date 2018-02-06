import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdutoresPage } from './produtores';

@NgModule({
  declarations: [
    ProdutoresPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdutoresPage),
  ],
})
export class ProdutoresPageModule {}
