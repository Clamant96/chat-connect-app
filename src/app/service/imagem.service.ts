import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagemService {

  public url = environment.server + environment.port;

  /* CRIA UM TOKEN, PARA REALIZAR A AUTENTICACAO DO ENDPOINT, POR MEIO DO METODO Authorization, PASSANDO COMO PAREMTRO O TOKEN DO USUARIO LOGADO */
  autorizacao = {
    headers: new HttpHeaders().set('Authorization', environment.token)

  }

  constructor(
    private http: HttpClient

  ) { }

  uploadImage(image: File): Observable<boolean> {
    const data: FormData = new FormData();

    data.append('type', image.type);
    data.append('file', image);
    data.append('contentType', image);
    data.append('empty', String(false));
    data.append('name', `${environment.username}/${image.name}`);
    data.append('originalFilename', `${environment.username}/${image.name}`);
    data.append('size', String(image.size));

    let nomeArquivo: string = String(this.getRandomInt(100000000, 999999999));

    environment.nomeUplaodImagem = `${nomeArquivo}.${image.name.split(".")[1]}`;

    return this.http.post<boolean>(`${this.url}/upload/${environment.username}/nomeArquivo/${nomeArquivo}`, data);
  }

  findImage(nomeUsuario: string, nomeImagem: string): Observable<File> {

    return this.http.get<File>(`${this.url}/image/carregar/${nomeUsuario}/${nomeImagem}`);
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
