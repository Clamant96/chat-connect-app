import { WebsocketService } from './../service/websocket.service';
import { WebSocketConnector } from './../../websocket/websocket-connector';
import { ConversaService } from './../service/conversa.service';
import { Usuario } from './../model/Usuario';
import { UsuarioService } from './../service/usuario.service';
import { Conversa } from './../model/Conversa';
import { ChatService } from './../service/chat.service';
import { Router } from '@angular/router';
import { Chat } from './../model/Chat';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
/*import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';*/

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  chat: Chat = new Chat();
  novoChat: Chat = new Chat();
  chatMemoria: Chat = new Chat();
  chatArray: Chat[];

  conversa: Conversa = new Conversa();
  conversaMemoria: Conversa = new Conversa();

  chatConversa: Chat = new Chat();

  usuarioConversa: Usuario = new Usuario();
  listDeUsuario: Usuario[];
  idsUsuariosChat: string = "";

  username = environment.username;
  avatar = environment.img;
  id = environment.id;
  imgConversaUsuario: string = "";

  statusMensagem: string = "";
  nomeChat: string = "";
  contador: number = 0;
  apresentaNome: boolean = false;
  memoriaIdChat: number = 0;
  addUsuarioChatClass: string = "";
  apresentaUsuario: string = "";
  //ultimaMensagem: string = "";

  idChatInputAtualizacao: number = 0;

  key = 'data';
  reverse = true;

  /* WebSocket - CONFIGURACAO */
  items: any[] = [];
  private webSocketConnector: WebSocketConnector;
  private stompClient: any;

  constructor(
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private conversaService: ConversaService,
    private websocketService: WebsocketService,
    private router: Router

  ) { }

  ngOnInit() {
    window.scroll(0, 0);

    if(localStorage.getItem('token') == null) {
      this.router.navigate(['/login']);

    }

    this.webSocketConnector = new WebSocketConnector(
      `${environment.server+environment.port}/socket`,
      '/statusProcessor',
      this.onMessage.bind(this)
    );

    //this.start();

    this.findAllChatsbyIdUsuario(this.id);

  }

  start() {
    this.websocketService.inicializaObservador().subscribe(resp => {
      console.log(resp);
    });

  }

  onMessage(message: any): void {
    // this.items.push(message.body);

    this.chatService.findByIdChat(this.idChatInputAtualizacao).subscribe((resp: Chat) => {
      this.chat = resp;
      console.log('RECEBENDO INPUT PARA ATUALIZAR CHAT');
      console.log(resp);
    });

  }

  /*onMessage() {
    this.items.push(this.conversa.conteudo);
  }*/

  findAllChatsbyIdUsuario(id: number) {

    this.chatService.findAllChatsByIdUsuario(id).subscribe((resp: Chat[]) => {
      this.chatArray = resp;

      this.chatArray.map(item => {

        if(item.tipo == "chat") {

          item.usuarios.map(i => {

            if(i.id != id) {

              this.usuarioService.findByIdUsuario(i.id).subscribe((resp: Usuario) => {
                item.nome = resp.username;
                item.img = resp.img;
              });

            }

          });

        }

      });

    });

  }

  findByIdChat(chat: Chat) {
    this.listDeUsuario = [];
    this.chatMemoria = chat;

    this.idChatInputAtualizacao = chat.id;

    this.chatService.findByIdChat(chat.id).subscribe((resp: Chat) => {
      this.chat = resp;
      console.log("CHAT DO FINDBYIDCHAT");
      console.log(this.chat);
    });

    this.validaTipoDeChat(chat);

    /*setInterval(() => {
      this.chatService.findByIdChat(chat.id).subscribe((resp: Chat) => {
        this.chat = resp;
      });

    }, 10);*/

  }

  findAllusuarios() {
    this.usuarioService.findAllUsuarios().subscribe((resp: Usuario[]) => {
      this.listDeUsuario = resp;

    });

  }

  findAllUsuariosConversa() {
    this.usuarioService.findAllUsuariosConversa(this.id).subscribe((resp: Usuario[]) => {
      this.listDeUsuario = resp;
    });

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

    this.chatService.findByIdChat(idChat).subscribe((resp: Chat) => {
      this.chat = resp;
    });

    setTimeout(() => {
      this.start();

    }, 1);

  }

  apresentaUsuarios(nomeChat: string) {
    this.chat = new Chat();

    if(nomeChat.length > 0) {
      this.findAllUsuariosConversa();

      this.addUsuarioChatClass = "add-usuario-chat";

    }else {
      this.listDeUsuario = [];

      this.addUsuarioChatClass = "";

    }

  }

  gerenciaChat(usuario: Usuario) {

    this.usuarioService.chatOuGrupo(this.id, usuario.id).subscribe((resp: Usuario) => {
      console.log("Chat criado com sucesso.");

      this.findAllChatsbyIdUsuario(this.id);

    }, erro => {
      console.log("Ocorreu um problema com a criacao do chat.");

    });

  }

  abrirNovoChat(usuario: Usuario) {

    this.novoChat.nome = usuario.username;
    this.novoChat.img = usuario.img;
    this.novoChat.tipo = "chat";

    console.log("Chat antes: ");
    console.log(this.novoChat);

    // criar o chat
    this.chatService.postChat(this.novoChat).subscribe((resp: Chat) => {
      console.log("resp chat:");
      console.log(resp);

      // ADICIONA O PRIMEIRO USUARIO
      this.usuarioService.chatOuGrupo(this.id, resp.id).subscribe((resp: Usuario) => {

      });

      // ADICIONA O SEGUNDO USUARIO
      this.usuarioService.chatOuGrupo(usuario.id, resp.id).subscribe((resp: Usuario) => {

        setTimeout(() => {
          this.findAllChatsbyIdUsuario(this.id);

          this.apresentaUsuario = "";
          this.listDeUsuario = [];

        }, 1);

      });

    });

    console.log("Chat depois: ");
    console.log(this.novoChat);

    // vincular o chat aos usuarios
    /*this.usuarioService.chatOuGrupo(this.id, usuario.id).subscribe((resp: Usuario) => {

      this.findAllChatsbyIdUsuario(this.id);

    }, erro => {
      console.log("Ocorreu um problema com a criacao do chat.");

    });*/

  }

  apresentaUsuarioParaChat() {

    var comprimentoLista: number = 0;

    try {
      this.listDeUsuario.map(item => {
        comprimentoLista++;

      });

    }catch(erro) {
      comprimentoLista = 0;

    }

    setTimeout(() => {
      if(comprimentoLista == 0) {
        this.findAllUsuariosConversa();

        this.apresentaUsuario = "add-usuario-chat";

      }else {
        this.listDeUsuario = [];

        this.apresentaUsuario = "";

      }

    }, 0.500);

  }

}
