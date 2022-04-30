import { Chat } from './../model/Chat';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  /* CONTRI O CAMINHO PARA O SERVIDOR */
  serverPort = environment.server + environment.port;

  constructor(
    private http: HttpClient

  ) { }

  autorizacao = {
    headers: new HttpHeaders().set('Authorization', environment.token)

  }

  findAllChatsByIdUsuario(id: number): Observable<Chat[]> {

    return this.http.get<Chat[]>(`${this.serverPort}/chats/conversas-chat/${id}`, this.autorizacao);
  }

  findByIdChat(id: number): Observable<Chat> {

    return this.http.get<Chat>(`${this.serverPort}/chats/${id}`, this.autorizacao);
  }

  postChat(chat: Chat): Observable<Chat> {

    return this.http.post<Chat>(`${this.serverPort}/chats`, chat, this.autorizacao);
  }

}
