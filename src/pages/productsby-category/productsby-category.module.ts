import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsbyCategoryPage } from './productsby-category';

@NgModule({
  declarations: [
    ProductsbyCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductsbyCategoryPage),
  ],
})
export class ProductsbyCategoryPageModule {}
