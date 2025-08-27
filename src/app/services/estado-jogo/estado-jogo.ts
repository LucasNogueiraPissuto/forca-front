import { Injectable } from '@angular/core';
import { ForcaJogoResponse } from '../../interfaces/ForcaJogoReponse';

@Injectable({
  providedIn: 'root'
})
export class EstadoJogoService {
  private jogoAtual: ForcaJogoResponse | null = null;

  setJogo(jogo: ForcaJogoResponse): void {
    this.jogoAtual = jogo;
  }

  getJogo(): ForcaJogoResponse | null {
    return this.jogoAtual;
  }

  clearJogo(): void {
    this.jogoAtual = null;
  }
}