import { Usuario } from './../model/Usuario';
import { UsuarioService } from './../service/usuario.service';
import { Conversa } from './../model/Conversa';
import { ChatService } from './../service/chat.service';
import { Router } from '@angular/router';
import { Chat } from './../model/Chat';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  chat: Chat = new Chat();
  chatArray: Chat[];

  conversa: Conversa = new Conversa();

  username = environment.username;
  avatar = environment.img;
  id = environment.id;

  statusMensagem: string = "";
  nomeChat: string = "";
  contador: number = 0;

  constructor(
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private router: Router

  ) { }

  ngOnInit() {
    window.scroll(0, 0);

    if(localStorage.getItem('token') == null) {
      this.router.navigate(['/login']);

    }

    this.findAllChatsbyIdUsuario(this.id);

  }

  findAllChatsbyIdUsuario(id: number) {

    this.chatService.findAllChatsByIdUsuario(id).subscribe((resp: Chat[]) => {
      this.chatArray = resp;

    });

  }

  findByIdChat(chat: Chat) {

    this.chatService.findByIdChat(chat.id).subscribe((resp: Chat) => {
      this.chat = resp;

    });

    this.validaTipoDeChat(chat);

  }

  ajustaMensagem(idUsuarioConversa: number, idUsuario: number) {

    if(idUsuarioConversa == idUsuario) {
      this.statusMensagem = "direita";
    }else {
      this.statusMensagem = "esquerda";
    }

    return this.statusMensagem;
  }

  ajustaNomeChat(chat: Chat) {

    chat.usuarios.map(item => {
      if(item.id != this.id && this.contador == 0) {
        this.usuarioService.findByIdUsuario(item.id).subscribe((resp: Usuario) => {
          this.nomeChat =  resp.username;

        });

        this.contador++;

      }

    });

    return this.nomeChat;
  }

  validaTipoDeChat(chat: Chat) {
    if(chat.tipo == "chat") {
      this.nomeChat = this.ajustaNomeChat(chat);

    }else {
      this.nomeChat = chat.nome;

    }
  }

  adicionarItemLista() {

  }

}
