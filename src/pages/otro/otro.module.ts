import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtroPage } from './otro';

@NgModule({
  declarations: [
    OtroPage,
  ],
  imports: [
    IonicPageModule.forChild(OtroPage),
  ],
})
export class OtroPageModule {}
