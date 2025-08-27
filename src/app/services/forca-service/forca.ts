import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // Certifique-se que map está importado se for usar
import { ForcaJogoResponse } from '../../interfaces/ForcaJogoReponse';

@Injectable({
  providedIn: 'root'
})
export class Forca {

  private baseUrl = 'http://localhost:8080/jogo'

  constructor(private http: HttpClient) { }

  iniciarJogo(email?: string): Observable<ForcaJogoResponse> {
    let params = new HttpParams();
    if (email) {
      params = params.set('email', email);
    }
    return this.http.get<ForcaJogoResponse>(`${this.baseUrl}/iniciar`, { params });
  }

  getJogoById(jogoId: string, email: String): Observable<ForcaJogoResponse> {
    return this.http.get<ForcaJogoResponse>(`${this.baseUrl}/${jogoId}/${email}`);
  }

  enviarPalpiteLetra(jogoId: number, palpite: string, email: string): Observable<ForcaJogoResponse> {
    const body = { email, palpite }; 
    return this.http.post<ForcaJogoResponse>(`${this.baseUrl}/${jogoId}/palpite`, body);
  }

getJogosPorEmail(email: string): Observable<ForcaJogoResponse[]> {
  return this.http.get<ForcaJogoResponse[]>(`${this.baseUrl}/${email}`).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404 || error.status === 400) {
        // Email não encontrado - lança erro específico
        return throwError(() => error);
      }
      // Para outros erros, propaga o erro
      return throwError(() => error);
    })
  );
}
}