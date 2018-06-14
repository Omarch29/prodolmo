import { partido_prediccion } from "./partido_prediccion";

export interface prediccion {
    categoria: string;
    usuario: string;
    partidos: partido_prediccion[];
}
