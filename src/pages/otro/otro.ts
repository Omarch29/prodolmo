import { PAISES } from '../../data/data.paises';
import { pais } from '../../models/pais';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { prediccion } from '../../models/prediccion';
import { Partido } from '../../models/partido';
import { ActionSheetController } from 'ionic-angular';



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
  resultadosUnfiltered: Partido[] = [];
  verJugados: boolean = false;
  categoria: string = "todos";


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    public afs: AngularFirestore,
    public actionSheetCtrl: ActionSheetController) {

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
    this.partidosObservable.subscribe(partidos_observable => {
      partidos_observable.forEach(partido => {
        // Merge Partidos
        partido['Equipo1'] = this.paises.find(pais => pais.id == partido.equipo1);
        partido['Equipo2'] = this.paises.find(pais => pais.id == partido.equipo2);
        this.predicciones.forEach(prediccion_partidos => {
          let partido_encontrado = prediccion_partidos.partidos.find(partido_prediccion => partido_prediccion.partido == partido.id);
          if (partido_encontrado != undefined) {
            partido['Prediccion'] = partido_encontrado;
          }
        });
        this.resultadosUnfiltered.push(partido);
      });
      //Resultados sin filtros
      this.resultados = this.resultadosUnfiltered;
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OtroPage');

  }

  mostrarFiltros() {
    this.actionSheetCtrl.create({
      title: 'Filtro',
      buttons: [
        {
          text: 'Fecha 1',
          handler: () => {
            this.resultados = this.resultadosUnfiltered.filter(resultado => resultado.categoria == "1");
            this.categoria = "Jornada 1";
          }
        },
        {
          text: 'Fecha 2',
          handler: () => {
            this.resultados = this.resultadosUnfiltered.filter(resultado => resultado.categoria == "2");
            this.categoria = "Jornada 2";
          }
        },
        {
          text: 'Fecha 3',
          handler: () => {
            this.resultados = this.resultadosUnfiltered.filter(resultado => resultado.categoria == "3");
            this.categoria = "Jornada 3";
          }
        },
        {
          text: 'Octavos',
          handler: () => {
            this.resultados = this.resultadosUnfiltered.filter(resultado => resultado.categoria == "octavos");
            this.categoria = "Octavos de Final";
          }
        },
        {
          text: 'Cuartos',
          handler: () => {
            this.resultados = this.resultadosUnfiltered.filter(resultado => resultado.categoria == "cuartos");
            this.categoria = "Cuartos de Final";
          }
        },
        {
          text: 'Semifinal',
          handler: () => {
            this.resultados = this.resultadosUnfiltered.filter(resultado => resultado.categoria == "semifinal");
            this.categoria = "Semifinal";
          }
        },
        {
          text: 'Tercer Puesto',
          handler: () => {
            this.resultados = this.resultadosUnfiltered.filter(resultado => resultado.categoria == "tercer");
            this.categoria = "Tercer Puesto";
          }
        },
        {
          text: 'Final',
          handler: () => {
            this.resultados = this.resultadosUnfiltered.filter(resultado => resultado.categoria == "final");
            this.categoria = "Final del Mundo";
          }
        },
        {
          text: 'Todos',
          handler: () => {
            this.resultados = this.resultadosUnfiltered;
            this.categoria = "Todos";
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    }).present();
  }


  cerrar() {
    this.viewCtrl.dismiss();
  }

}
