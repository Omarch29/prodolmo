import { PAISES } from '../../data/data.paises';
import { pais } from '../../models/pais';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { prediccion } from '../../models/prediccion';
import { Partido } from '../../models/partido';

@IonicPage()
@Component({
  selector: 'page-otro',
  templateUrl: 'otro.html',
})
export class OtroPage {
  userSelected: usuario;
  paises: pais[] = [];

  prediccionesCollection: AngularFirestoreCollection<prediccion>;
  prediccionesObservable: Observable<prediccion[]>;
  predicciones: prediccion[] = [];

  partidosCollection: AngularFirestoreCollection<Partido>;
  partidosObservable: Observable<Partido[]>;
  resultados: Partido[] = [];

  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private afs: AngularFirestore) {
    // Cargar Paises
    this.paises = PAISES.slice(0);

    // Get Usuario Seleccionado
    this.userSelected = this.navParams.get('user');

    // Cargar Predicciones
    this.prediccionesCollection = afs.collection<prediccion>('predicciones', ref => ref.where('usuario', '==', this.userSelected.id));
    this.prediccionesObservable = this.prediccionesCollection.valueChanges();
    this.prediccionesObservable.subscribe(predicciones_observable => {
      predicciones_observable.forEach(prediccion => this.predicciones.push(prediccion));
    });

    // Cargar Partidos
    this.partidosCollection = afs.collection<Partido>('partidos', ref => ref.orderBy('fecha'));
    this.partidosObservable = this.partidosCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Partido;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
    this.partidosObservable.subscribe(partidos_observable => partidos_observable.forEach(partido => {
      // Merge Partidos
        partido['Equipo1'] = this.paises.find(pais => pais.id == partido.equipo1);
        partido['Equipo2'] = this.paises.find(pais => pais.id == partido.equipo2);
        this.predicciones.forEach(prediccion_partidos => {
          let partido_encontrado = prediccion_partidos.partidos.find(partido_prediccion => partido_prediccion.partido == partido.id);
          if (partido_encontrado != undefined) {
            partido['Prediccion'] = partido_encontrado;
          }
        });
        this.resultados.push(partido);    
    }));

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OtroPage');

  }

  cerrar() {
    this.viewCtrl.dismiss();
  }

}
