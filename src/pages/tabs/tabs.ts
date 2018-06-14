import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScorePage } from '../score/score';
import { ResultadosPage } from '../resultados/resultados';
import { CargarPage } from '../cargar/cargar';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  userSelected: usuario; 
  userParam:any = {};
  tab1: any;
  tab2: any;
  tab3: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tab1 = ScorePage;
    this.tab2 = ResultadosPage;
    this.tab3 = CargarPage;

    this.userSelected = this.navParams.get('user');
    this.userParam = { user: this.userSelected };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
