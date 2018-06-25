import { PAISES } from '../../data/data.paises';
import { pais } from '../../models/pais';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Partido } from '../../models/partido';
import { ActionSheetController } from 'ionic-angular';



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
  resultadosUnfiltered: Partido[] = [];
  verJugados: boolean = false;
  categoria: string = "Todos";

  constructor(public navCtrl: NavController, public navParams: NavParams, public afs: AngularFirestore,
    public actionSheetCtrl: ActionSheetController
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
      this.resultadosUnfiltered = this.resultados;
    }, error => {
      console.log(error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultadosPage');
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


}
