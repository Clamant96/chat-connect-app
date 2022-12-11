import { Observable } from 'rxjs';
import { Figurinha } from './../model/Figurinha';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FigurinhaService {

  /* CONTRI O CAMINHO PARA O SERVIDOR */
  serverPort = environment.server + environment.port;

  constructor(
    private http: HttpClient

  ) { }

  autorizacao = {
    headers: new HttpHeaders().set('Authorization', environment.token)

  }

  findByIdFigurinha(id: number): Observable<Figurinha> {

    return this.http.get<Figurinha>(`${this.serverPort}/figurinha/${id}`, this.autorizacao);
  }

  findByAllFigurinhas(): Observable<Figurinha[]> {

    return this.http.get<Figurinha[]>(`${this.serverPort}/figurinha`, this.autorizacao);
  }

  getAllFigurinhasByUsuarioId(id: number): Observable<Figurinha[]> {

    return this.http.get<Figurinha[]>(`${this.serverPort}/figurinha/figurinhas-usuario/${id}`, this.autorizacao);
  }

  postfigurinha(figurinha: Figurinha): Observable<Figurinha> {

    // conversa.img = environment.nomeUplaodImagem;

    return this.http.post<Figurinha>(`${this.serverPort}/figurinha`, figurinha, this.autorizacao);
  }

}
