import { PAISES } from '../../data/data.paises';
import { pais } from '../../models/pais';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Partido } from '../../models/partido';


@IonicPage()
@Component({
  selector: 'page-resultados',
  templateUrl: 'resultados.html',
})
export class ResultadosPage {
  private itemsCollection: AngularFirestoreCollection<Partido>;
  items: Observable<Partido[]>;
  paises: pais[] = [];
  resultados: Partido[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore
  ) {
    this.itemsCollection = afs.collection<Partido>('partidos', ref => ref.orderBy('fecha'));
    this.items = this.itemsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Partido;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });

    this.items.subscribe( partidos => {
      if (PAISES != undefined && PAISES.length > 0) {
        this.paises = PAISES.slice(0);  
      }else{
        console.log(PAISES);
        return;
      }
      partidos.forEach(partido => {
        partido['Equipo1'] = this.paises.find(pais => pais.id == partido.equipo1);
        partido['Equipo2'] = this.paises.find(pais => pais.id == partido.equipo2);
        this.resultados.push(partido);
      });
      console.log(this.resultados);
    }, error => {
      console.log(error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultadosPage');
  }

}
