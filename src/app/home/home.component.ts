import { ConversaService } from './../service/conversa.service';
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
  chatMemoria: Chat = new Chat();
  chatArray: Chat[];

  conversa: Conversa = new Conversa();
  conversaMemoria: Conversa = new Conversa();

  chatConversa: Chat = new Chat();
  usuarioConversa: Usuario = new Usuario();

  username = environment.username;
  avatar = environment.img;
  id = environment.id;
  imgConversaUsuario: string = "";

  statusMensagem: string = "";
  nomeChat: string = "";
  contador: number = 0;
  apresentaNome: boolean = false;
  memoriaIdChat: number = 0;
  //ultimaMensagem: string = "";

  key = 'data';
  reverse = true;

  constructor(
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private conversaService: ConversaService,
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
    this.chatMemoria = chat;

    this.chatService.findByIdChat(chat.id).subscribe((resp: Chat) => {
      this.chat = resp;
      console.log("CHAT DO FINDBYIDCHAT");
      console.log(this.chat);
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
    this.contador = 0;

    chat.usuarios.map(item => {
      if(item.id != this.id && this.contador == 0) {
        this.usuarioService.findByIdUsuario(item.id).subscribe((resp: Usuario) => {
          this.nomeChat =  resp.username;
          this.imgConversaUsuario = resp.img;

        });

        this.contador++;

      }

    });

    return this.nomeChat;
  }

  validaTipoDeChat(chat: Chat) {
    this.nomeChat = "";

    if(chat.tipo == "chat") {
      this.nomeChat = this.ajustaNomeChat(chat);
      console.log();
      this.apresentaNome = this.apresentaNomeUsuario(chat.tipo);

      //this.ultimaMensagem = chat.conversas[chat.conversas.length - 1].conteudo;

    }else {
      this.nomeChat = chat.nome;

    }

    this.memoriaIdChat = chat.id;

  }

  apresentaNomeUsuario(tipo: string) {

    var retorno = false;

    if(tipo != "chat") {
      retorno = true;

    }else {
      retorno = false;

    }

    return retorno;
  }

  adicionarItemLista(idUsuario: number, idChat: number) {

    this.usuarioConversa.id = idUsuario;
    this.chatConversa.id = idChat;

    this.conversa.usuario = this.usuarioConversa;
    this.conversa.chat = this.chatConversa;

    console.log(this.conversa);

    this.conversaMemoria.conteudo = this.conversa.conteudo;
    this.conversaMemoria.data = new Date();

    this.conversaService.postConversa(this.conversa).subscribe((resp: Conversa) => {
      console.log('Conversa enviada com sucesso.');

      this.usuarioService.findByIdUsuario(idUsuario).subscribe((resp: Usuario) => {
        this.conversaMemoria.usuario = resp;
      });

      this.chatService.findByIdChat(idChat).subscribe((resp: Chat) => {
        this.conversaMemoria.chat = resp;
      });

      this.chat.conversas.push(this.conversaMemoria);

      this.conversa = new Conversa();

    }, e => {
      console.log('Ocorreu um erro no envio da conversa.');

    });

  }

}
