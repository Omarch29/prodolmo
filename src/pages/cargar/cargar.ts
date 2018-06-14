import { PAISES } from '../../data/data.paises';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { switchMap } from 'rxjs/operators';
import { Partido } from '../../models/partido';
import { pais } from '../../models/pais';
import { partido_prediccion } from '../../models/partido_prediccion';
import { prediccion } from '../../models/prediccion';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cargar',
  templateUrl: 'cargar.html',
})
export class CargarPage {
  prediccionesCollection: AngularFirestoreCollection<prediccion>;
  prediccionesObservable: Observable<prediccion[]>;
  predicciones: prediccion[] = [];
  partidos$: Observable<any[]>;
  categoriaFilter$: BehaviorSubject<string | null>;
  paises: pais[] = [];
  resultados: Partido[] = [];
  firstClick: boolean;
  categoria: string;
  categoria_id: string;
  userSelected: usuario;
  PoseeDatosCargados: boolean = false;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afs: AngularFirestore,
    public toastCtrl: ToastController) {
    this.paises = [];
    if (PAISES != undefined && PAISES.length > 0) {
      this.paises = PAISES.slice(0);
    }
    this.firstClick = true;
    // get usuario from params
    this.userSelected = this.navParams.get('user');
    
    // Predicciones
    this.prediccionesCollection = afs.collection<prediccion>('predicciones', ref => ref.where('usuario', '==',  this.userSelected.id ));
    this.prediccionesObservable = this.prediccionesCollection.valueChanges();
    this.prediccionesObservable.subscribe(predicciones_observable => {
      predicciones_observable.forEach(prediccion => this.predicciones.push(prediccion));  
    });

    // Lista de partidos por categoria
    this.categoriaFilter$ = new BehaviorSubject(null);
    this.partidos$ = combineLatest(
      this.categoriaFilter$,
    ).pipe(
      switchMap(([categoria]) =>
        afs.collection('partidos', ref =>
          ref.where('categoria', '==', categoria)
        ).snapshotChanges().map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Partido;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      )
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CargarPage');
  }

  cargar_categoria(categoria: string) {
    //verificar categorias cargadas anteriormente
    this.verificar_predicciones_cargadas_por_categoria(categoria);
    
    this.categoria_id = categoria;
    this.categoriaFilter$.next(categoria);
    this.partidos$.subscribe(partidos => {
      this.resultados = [];
      let predicciones_categoria = this.predicciones.find(x => x.categoria == this.categoria_id);
      partidos.forEach(partido => {
        partido['Equipo1'] = this.paises.find(pais => pais.id == partido.equipo1);
        partido['Equipo2'] = this.paises.find(pais => pais.id == partido.equipo2);
        if (predicciones_categoria != undefined && predicciones_categoria.partidos.length > 0) {
          let predicciones_partido = predicciones_categoria.partidos.find( x=> x.partido == partido['id']);
          partido['prediccion1'] = predicciones_partido.goles1 ;
          partido['prediccion2'] = predicciones_partido.goles2;
        }else{
        partido['prediccion1'] = 0;
        partido['prediccion2'] = 0;
        }
        this.resultados.push(partido);
      });
      this.resultados.sort((a, b) => {
        if (a.fecha < b.fecha) return -1;
        else if (a.fecha > b.fecha) return 1;
        else return 0;
      });
    }, error => {
      console.log(error);
    });
  }

  verificar_predicciones_cargadas_por_categoria(categoria: string) {
      let predicciones_x_categoria = this.predicciones.find(x => x.categoria == categoria);
      if ( predicciones_x_categoria != undefined && predicciones_x_categoria.partidos.length > 0){
        this.PoseeDatosCargados = true;
      }else{
      this.PoseeDatosCargados = false;
      }
  }


  cargarFecha(fecha: number) {
    switch (fecha) {
      case 1:
        this.cargar_categoria("1");
        this.categoria = 'Jornada 1';
        break;
      case 2:
        this.cargar_categoria("2");
        this.categoria = 'Jornada 2';
        break;
      case 3:
        this.cargar_categoria("3");
        this.categoria = 'Jornada 3';
        break;
      case 4:
        this.cargar_categoria("octavos");
        this.categoria = 'Octavos de Final';
        break;
      case 5:
        this.cargar_categoria("cuartos");
        this.categoria = 'Cuartos de Final';
        break;
      case 6:
        this.cargar_categoria("semifinal");
        this.categoria = 'SemiFinal';
        break;
      case 7:
        this.cargar_categoria("tercer");
        this.categoria = 'Tercer Puesto';
        break;
      case 8:
        this.cargar_categoria("final");
        this.categoria = 'Final del Mundo';
        break;
      default:
        break;
    }
    this.firstClick = false;
  }

  add_goal(i: number, isEquipo1: boolean) {
    if (isEquipo1) {
      this.resultados[i]['prediccion1'] = this.resultados[i]['prediccion1'] + 1;
    } else {
      this.resultados[i]['prediccion2'] = this.resultados[i]['prediccion2'] + 1;
    }
  }

  rest_goal(i: number, isEquipo1: boolean) {
    if (isEquipo1) {
      let current_number1 = this.resultados[i]['prediccion1'];
      if (current_number1 >= 1) {
        this.resultados[i]['prediccion1'] = current_number1 - 1;
      }

    } else {
      let current_number2 = this.resultados[i]['prediccion2'];
      if (current_number2 >= 1) {
        this.resultados[i]['prediccion2'] = current_number2 - 1;
      }
    }
  }

  guardar() {
    if (this.PoseeDatosCargados) {
      return;
    }
    let partidosPredicciones: partido_prediccion[] = [];
    this.resultados.forEach(resultado => {
      // resultado['prediccion1']
      let partido_prediccion : partido_prediccion = {
        partido: resultado.id,
        goles1: resultado['prediccion1'],
        goles2: resultado['prediccion2'],
      }
      partidosPredicciones.push(partido_prediccion);
    })

    let nuevaPrediccion: prediccion = {
      categoria: this.categoria_id,
      usuario: this.userSelected.id,
      partidos: partidosPredicciones
    }

    this.prediccionesCollection.add(nuevaPrediccion).then( ()=> {
      this.verificar_predicciones_cargadas_por_categoria(this.categoria_id);
      this.toastCtrl.create({
        message: 'Datos guardados correctamente',
        position: 'middle',
        duration: 5000,
      }).present();
    }, error => {
      this.toastCtrl.create({
        message: 'Error',
        position: 'middle',
        duration: 1500,
      }).present();
      console.log(error);
    });
    
    console.log(nuevaPrediccion);
  }



}
