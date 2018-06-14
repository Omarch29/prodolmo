import { DateTime } from "ionic-angular";

export interface Partido{
    id: string,
    categoria: string,
    equipo1: string,
    equipo2: string,
    fecha: DateTime,
    goles1: number,
    goles2: number,
    grupo: string,
    jugado: boolean    
}