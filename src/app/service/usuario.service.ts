import { UsuarioLogin } from './../model/UsuarioLogin';
import { Usuario } from './../model/Usuario';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  /* CONTRI O CAMINHO PARA O SERVIDOR */
  serverPort = environment.server + environment.port;

  constructor(
    private http: HttpClient

  ) { }

  autorizacao = {
    headers: new HttpHeaders().set('Authorization', environment.token)

  }

  /* RETORNA UM USUARIO POR MEIO DO ID */
  findByIdUsuario(id: number): Observable<Usuario> {

    return this.http.get<Usuario>(`${this.serverPort}/usuarios/${id}`, this.autorizacao);
  }

  findAllUsuarios(): Observable<Usuario[]> {

    return this.http.get<Usuario[]>(`${this.serverPort}/usuarios`, this.autorizacao);
  }

  findAllUsuariosConversa(id: number): Observable<Usuario[]> {

    return this.http.get<Usuario[]>(`${this.serverPort}/usuarios/usuarios-conversa/${id}`, this.autorizacao);
  }

  login(usuarioLogin: UsuarioLogin): Observable<UsuarioLogin> {

    return this.http.post<UsuarioLogin>(`${this.serverPort}/usuarios/logar`, usuarioLogin);
  }

  /* Observable<> ==> Verifica se os dados inseridos no metodo, sao do tipo User */
  cadastrar(usuario: Usuario): Observable<Usuario> {

    /* O METODO RETORNA O TIPO User, E INSERE O DADO  */
    return this.http.post<Usuario>(`${this.serverPort}/usuarios/cadastrar`, usuario);
  }

  atualizar(usuario: Usuario): Observable<Usuario> {

    return this.http.put<Usuario>(`${this.serverPort}/usuarios/atualizar`, usuario, this.autorizacao);
  }

  /* RETONA UM VALOR true OU false CASO O TOKEN ESTA PREENCHIDO, CASO ESTEJA VAZIO RETONA false, CASO ESTEJA COM DADOS RETONA true*/
  logado() {
    /* CRIA UMA VARIAVEL BOOLEAN */
    let ok: boolean = false;

    /* CRIA UMA CONDIZIONAL, CASO MEU TOKEN QUE VEM DA MINHA VARIAVEL BLOBAL, ESTEJA COM ALGUM DADO, ATRIBUA 'true' A MINHA VARIAVEL 'ok' */
    if(environment.token != '') {
      /* ATRIBUI 'true' A VARAIVEL 'ok' */
      ok = true;

    }

    /* RETORNA O VALOR DA VARIAVEL */
    return ok;
  }

  chatOuGrupo(idUsuario: number, idChat: number): Observable<Usuario> {

    return this.http.get<Usuario>(`${this.serverPort}/usuarios/usuario_chats/conversa/${idUsuario}/${idChat}`, this.autorizacao)
  }

}
