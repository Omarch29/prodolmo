import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { prediccion } from '../../models/prediccion';
import { Partido } from '../../models/partido';
import { ModalController } from 'ionic-angular';
import { OtroPage } from '../otro/otro';


@IonicPage()
@Component({
  selector: 'page-score',
  templateUrl: 'score.html',
})
export class ScorePage {
  userSelected: usuario;

  usuariosCollection: AngularFirestoreCollection<usuario>;
  usuariosObservable: Observable<usuario[]>;
  usuarios: usuario[] = [];

  prediccionesCollection: AngularFirestoreCollection<prediccion>;
  prediccionesObservable: Observable<prediccion[]>;
  predicciones: prediccion[] = [];

  partidosCollection: AngularFirestoreCollection<Partido>;
  partidosObservable: Observable<Partido[]>;
  resultados: Partido[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore, public modalCtrl: ModalController) {
    // get usuario from params
    this.userSelected = this.navParams.get('user');

    // Cargar Partidos
    this.partidosCollection = afs.collection<Partido>('partidos', ref => ref.orderBy('fecha'));
    this.partidosObservable = this.partidosCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Partido;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
    this.partidosObservable.subscribe(partidos_observable => partidos_observable.forEach(partido => this.resultados.push(partido)));

    // Cargar Predicciones
    this.prediccionesCollection = afs.collection<prediccion>('predicciones');
    this.prediccionesObservable = this.prediccionesCollection.valueChanges();
    this.prediccionesObservable.subscribe(predicciones_observable => {
      predicciones_observable.forEach(prediccion => this.predicciones.push(prediccion));
    });

    // Cargar Usuarios
    this.usuariosCollection = afs.collection<usuario>('usuarios');
    this.usuariosObservable = this.usuariosCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as usuario;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
    
  


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScorePage');

    // Calcular Puntajes
    this.usuariosObservable.subscribe(usuarios_observable => {
      usuarios_observable.forEach(usuario => {
        let puntaje: number = 0;
        let predicciones_x_usuario = this.predicciones.filter(predicciones => predicciones.usuario === usuario.id);
        
        predicciones_x_usuario.forEach(prediccion => {
          let resultados_concretados = this.resultados
            .filter(x => x.jugado === true)
            .forEach(resultado => {
              let partido_jugado = prediccion.partidos.find(x => x.partido == resultado.id);
              if (partido_jugado) {
                //si el jugador adivino el resultado
                if (partido_jugado.goles1 == resultado.goles1 && partido_jugado.goles2 == resultado.goles2) {
                  puntaje = puntaje + 3;
                } else {
                  if ((partido_jugado.goles1 > partido_jugado.goles2) == (resultado.goles1 > resultado.goles2)) {
                    puntaje = puntaje + 1;
                  } else if (partido_jugado.goles1 == partido_jugado.goles2 && resultado.goles1 == resultado.goles2) {
                    puntaje = puntaje + 1;
                  }
                }
              }
            });
        });

        usuario['puntaje'] = puntaje;
        if (this.predicciones.length > 0) {
          this.usuarios.push(usuario);  
        }
      });
    }, error => {
      console.log(error);
    });

  }

  CargarPrediccionesOtros(user_selected: usuario) {
    const modal = this.modalCtrl.create(OtroPage, { user: user_selected });
    modal.present();
  }


}
