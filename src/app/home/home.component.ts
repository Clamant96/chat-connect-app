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

  listaUsuariosGrupo: Usuario[] = [];

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
  removeListaUsuariosGrupo: string = "qtd-itens-lista-grupo";
  inicioChat: string = "inicio-chat";
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

    if(this.idChatInputAtualizacao > 0) {
      this.chatService.findByIdChat(this.idChatInputAtualizacao).subscribe((resp: Chat) => {

        /*resp.conversas.map(item => {
          item.conteudo = atob(item.conteudo); // DESCRIPTOGRAFA DADOS
        });*/

        this.chat = resp;
        console.log('RECEBENDO INPUT PARA ATUALIZAR CHAT');
        console.log(resp);
      });

    }

  }

  /*onMessage() {
    this.items.push(this.conversa.conteudo);
  }*/

  findAllChatsbyIdUsuario(id: number) {

    this.chatService.findAllChatsByIdUsuario(id).subscribe((resp: Chat[]) => {
      this.chatArray = resp;

      console.log('CHAT ARRAY: ');
      console.log(this.chatArray);

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

        } else {
          this.imgConversaUsuario = "https://i0.wp.com/emotioncard.com.br/wp-content/uploads/2016/05/perfil-whatsapp.jpg?fit=600%2C600&ssl=1";

        }

      });

    });

  }

  findByIdChat(chat: Chat) {
    this.listDeUsuario = [];
    this.chatMemoria = chat;

    // REMOVE OS DADOS DO GRUPO CARREGADO PARA CADASTRO
    this.novoChat = new Chat();
    this.nomeChat = "";
    this.addUsuarioChatClass = "";
    this.removeListaUsuariosGrupo = "qtd-itens-lista-grupo";
    this.listaUsuariosGrupo = [];

    this.idChatInputAtualizacao = chat.id;

    this.apresentaUsuario = "";

    this.chatService.findByIdChat(chat.id).subscribe((resp: Chat) => {

      /*resp.conversas.map(item => {
        item.conteudo = atob(item.conteudo); // DESCRIPTOGRAFA DADOS
      });*/

      this.chat = resp;
      // this.imgConversaUsuario = resp.img;

      if(resp.tipo == "chat") {
        console.log("E CHAT");

        resp.usuarios.map(i => {

          if(i.id != this.id) {

            this.usuarioService.findByIdUsuario(i.id).subscribe((resp: Usuario) => {
              this.imgConversaUsuario = resp.img;
            });

          }

        });

        console.log("this.imgConversaUsuario: "+ this.imgConversaUsuario);

      }else {
        console.log("NAO E CHAT");
        this.imgConversaUsuario = "https://i0.wp.com/emotioncard.com.br/wp-content/uploads/2016/05/perfil-whatsapp.jpg?fit=600%2C600&ssl=1";

      }

      console.log("CHAT DO FINDBYIDCHAT");
      console.log(this.chat);

      console.log("this.imgConversaUsuario: "+ this.imgConversaUsuario);

    });

    this.validaTipoDeChat(chat);

    /*setInterval(() => {
      this.chatService.findByIdChat(chat.id).subscribe((resp: Chat) => {
        this.chat = resp;
      });

    }, 10);*/

    this.inicioChat = "remove-inicio-chat";

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

    try {

      this.usuarioConversa.id = idUsuario;
      this.chatConversa.id = idChat;

      this.conversa.usuario = this.usuarioConversa;
      this.conversa.chat = this.chatConversa;

      /* CRIPTOGRAFAR DADOS BASE64 */
      // ENCODE -> btoa("TESTE BASE 64");
      // DECODE -> atob("cGFzc3dvcmQ=");
      // this.conversa.conteudo = btoa(this.conversa.conteudo);
      /* ------------------------- */

      console.log(this.conversa);

      this.conversaMemoria.conteudo = this.conversa.conteudo;
      this.conversaMemoria.data = new Date();

      this.conversaService.postConversa(this.conversa).subscribe((resp: Conversa) => {
        console.log('Conversa enviada com sucesso.');

        this.usuarioService.findByIdUsuario(idUsuario).subscribe((resp: Usuario) => {
          this.conversaMemoria.usuario = resp;
        });

        this.chatService.findByIdChat(idChat).subscribe((resp: Chat) => {
          /*resp.conversas.map(item => {
            item.conteudo = atob(item.conteudo); // DESCRIPTOGRAFA DADOS
          });*/

          this.conversaMemoria.chat = resp;
        });

        this.chat.conversas.push(this.conversaMemoria);

        this.conversa = new Conversa();

      }, e => {
        console.log('Ocorreu um erro no envio da conversa.');

      });

      this.chatService.findByIdChat(idChat).subscribe((resp: Chat) => {
        /*resp.conversas.map(item => {
          item.conteudo = atob(item.conteudo); // DESCRIPTOGRAFA DADOS
        });*/

        this.chat = resp;
      });

      setTimeout(() => {
        this.start();

      }, 1);

    }catch(erro) {
      console.log(erro);
    }

  }

  apresentaUsuarios(nomeChat: string) {
    this.chat = new Chat();

    /*let contadorUsuariosGrupo: number = this.listaUsuariosGrupo.length;

    if(!this.listaUsuariosGrupo == undefined || !this.listaUsuariosGrupo == null) {
      this.listaUsuariosGrupo.map(item => {
        contadorUsuariosGrupo++;

      });

    }*/

    if(nomeChat.length > 0) {
      this.apresentaUsuario = "remove-block";
      this.addUsuarioChatClass = "add-usuario-chat";
      this.removeListaUsuariosGrupo = "";

      this.nomeChat = "Usuarios para o grupo: ";
      this.imgConversaUsuario = "../../assets/img/perfil.svg";

      this.findAllUsuariosConversa();

    }else {
      this.listDeUsuario = [];
      this.listaUsuariosGrupo = [];

      this.nomeChat = "";
      this.addUsuarioChatClass = "";
      this.removeListaUsuariosGrupo = "qtd-itens-lista-grupo";

    }

    this.inicioChat = "remove-inicio-chat";

  }

  gerenciaChat(usuario: Usuario) {

    const indexOfObject = this.listaUsuariosGrupo.findIndex((object) => {
      return object.id === usuario.id;
    });

    console.log(indexOfObject); // -> 1

    if (indexOfObject !== -1) {
      this.listaUsuariosGrupo.splice(indexOfObject, 1);

    }else {
      this.listaUsuariosGrupo.push(usuario);

    }

    console.log(this.listaUsuariosGrupo);

  }

  addUsuariosAoGrupo() {

    /*this.usuarioService.chatOuGrupo(this.id, usuario.id).subscribe((resp: Usuario) => {
      console.log("Chat criado com sucesso.");

      this.findAllChatsbyIdUsuario(this.id);

    }, erro => {
      console.log("Ocorreu um problema com a criacao do chat.");

    });*/

    //this.novoChat.img = usuario.img;
    this.novoChat.img = "https://i0.wp.com/emotioncard.com.br/wp-content/uploads/2016/05/perfil-whatsapp.jpg?fit=600%2C600&ssl=1";
    this.novoChat.tipo = "grupo";

    // CRIAR O GRUPO
    this.chatService.postChat(this.novoChat).subscribe((resp: Chat) => {
      console.log("resp chat:");
      console.log(resp);

      // ADICIONA O PRIMEIRO USUARIO <CRIADOS DO GRUPO>
      this.usuarioService.chatOuGrupo(this.id, resp.id).subscribe((resp: Usuario) => {

      });

      // UTILIZA O ARRAY DE USUARIOS PARA INSERIR OS USUARIOS AO GRUPO RECEM CRIADO
      this.listaUsuariosGrupo.map(item => {

        // ADICIONA OS USUARIOS CARREGADOS NA LISTA <DEMAIS USUARIOS>
        this.usuarioService.chatOuGrupo(item.id, resp.id).subscribe((resp: Usuario) => {
          console.log("Usuarios inserido no grupo com sucesso");

        }, erro => {
          console.log("Ocorreu um erro ao tentar adicionar o usuario ao grupo");

        });

      }, 2);

      let memoriaArrayChat = this.chatArray.length;

      setTimeout(() => {

        this.findAllChatsbyIdUsuario(this.id);

        this.apresentaUsuario = "";
        this.listDeUsuario = [];

        setTimeout(() => {
          this.chatService.findByIdChat(resp.id).subscribe((resp: Chat) => {
            this.findByIdChat(resp);

            this.novoChat = new Chat();

          });

        }, 2);

        if(memoriaArrayChat == this.chatArray.length) {
          setTimeout(() => {
            this.findAllChatsbyIdUsuario(this.id);

          },3);

        }

      }, 1);

      this.apresentaUsuario = "add-usuario-chat";
      this.addUsuarioChatClass = "remove-block";
      this.removeListaUsuariosGrupo = "qtd-itens-lista-grupo";
      this.imgConversaUsuario = resp.img;

      this.novoChat = new Chat();

    });

    console.log("Chat depois: ");
    console.log(this.novoChat);

  }

  abrirNovoChat(usuario: Usuario) {

    this.novoChat.nome = usuario.username;
    this.novoChat.img = usuario.img;
    this.novoChat.tipo = "chat";

    let jaExisteEmMinhaLista: boolean = false;
    let gravaChatReload: Chat = new Chat();

    this.chatArray.map(item => {
      item.usuarios.map(i => {

        let valor: string = String(i.id);

        if(valor.includes(String(usuario.id)) && item.tipo == "chat") {
          jaExisteEmMinhaLista = true;
          gravaChatReload = item;
        }

      })

    });

    if(!jaExisteEmMinhaLista) { // NAO EXISTE
      // criar o chat
      this.chatService.postChat(this.novoChat).subscribe((resp: Chat) => {
        console.log("resp chat:");
        console.log(resp);

        gravaChatReload = resp;

        console.log(gravaChatReload);

        // ADICIONA O PRIMEIRO USUARIO
        this.usuarioService.chatOuGrupo(this.id, resp.id).subscribe((resp: Usuario) => {

        });

        // ADICIONA O SEGUNDO USUARIO
        this.usuarioService.chatOuGrupo(usuario.id, resp.id).subscribe((resp: Usuario) => {

          setTimeout(() => {
            this.findAllChatsbyIdUsuario(this.id);

            this.apresentaUsuario = "";
            this.listDeUsuario = [];

            setTimeout(() => {
              this.chatService.findByIdChat(gravaChatReload.id).subscribe((resp: Chat) => {
                this.findByIdChat(resp);

                this.novoChat = new Chat();

              });

            }, 2);

          }, 1);

        });

      });

      console.log("Chat depois: ");
      console.log(this.novoChat);

    }else { // JA EXISTE
      this.findByIdChat(gravaChatReload);

      this.apresentaUsuario = "add-usuario-chat";
      this.addUsuarioChatClass = "remove-block";

      this.apresentaUsuario = "";
      this.listDeUsuario = [];

      this.novoChat = new Chat();

    }

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

        this.nomeChat = "Lista de usuarios";
        this.imgConversaUsuario = "../../assets/img/perfil.svg";

        this.findAllUsuariosConversa();

        this.apresentaUsuario = "add-usuario-chat";
        this.addUsuarioChatClass = "remove-block";
        this.chat = new Chat();

      }else {
        this.listDeUsuario = [];

        this.apresentaUsuario = "";

      }

    }, 0.500);

    this.inicioChat = "remove-inicio-chat";

  }

}
