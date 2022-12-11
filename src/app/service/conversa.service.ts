import { Observable } from 'rxjs';
import { Conversa } from './../model/Conversa';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConversaService {

  /* CONTRI O CAMINHO PARA O SERVIDOR */
  serverPort = environment.server + environment.port;

  constructor(
    private http: HttpClient

  ) { }

  autorizacao = {
    headers: new HttpHeaders().set('Authorization', environment.token)

  }

  findByIdConversa(id: number): Observable<Conversa> {

    return this.http.get<Conversa>(`${this.serverPort}/conversas/${id}`, this.autorizacao);
  }

  postConversa(conversa: Conversa): Observable<Conversa> {

    // conversa.img = environment.nomeUplaodImagem;

    return this.http.post<Conversa>(`${this.serverPort}/conversas`, conversa, this.autorizacao);
  }

}
