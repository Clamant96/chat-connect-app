import { Observable } from 'rxjs';
import { FigurinhaService } from './../service/figurinha.service';
import { ImagemService } from './../service/imagem.service';
import { Figurinha } from './../model/Figurinha';
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

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}

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
  retiraChat: string = "";
  retiraUsuarios: string = "";
  //ultimaMensagem: string = "";

  abreCampoParaVisualizarFigurinhas: string = "";
  habilitaModalEmojiEfigurinha: boolean = false;

  idChatInputAtualizacao: number = 0;

  key = 'data';
  reverse = true;

  /* CONTROLE DE OPCAO PARA CHAT OU GRUPO */
  itemChat: boolean = true;
  itemGrupo: boolean = false;

  /* CONTROLE DIGITOS PARA RETORNO AO CHAT */
  contadorDigitos: number = 0;
  contadorTentativas: number = 0;

  /* RENDERIZA ITEM */
  renderizaItem: string = "";
  ajustaCorIconeFigurinha: string = '';
  ajustaCorIconeEmoji: string = 'ajusta-cor-icone';
  ajustaCorIconeAddFigurinha = '';

  /* MONTAGEM DE URL PARA CARREGAMENTO DE IMAGENS */
  public url: string = `${environment.server}${environment.port}`;

  /* OBJ FIGURINHA */
  public listaFigurinhasDoUsuario: Figurinha[];

  /* ENVIO DE POSTAGEM COM IMG */
  selectedFile: ImageSnippet;

  file: File;

  img: string = "" // IMG CARREGADA PARA POSTAGEM

  urlImg: any;
  msg: string = "";

  imgRenderizada: string = "";

  conteudoConversa: string = "";

  /* SELECAO DE EMOJI */
  public icones: string[] = [
    "😀",
    "😁",
    "😂",
    "😃",
    "😄",
    "😅",
    "😆",
    "😇",
    "😈",
    "😉",
    "😊",
    "😋",
    "😌",
    "😍",
    "😎",
    "😏",
    "😐",
    "😑",
    "😒",
    "😓",
    "😔",
    "😕",
    "😖",
    "😗",
    "😘",
    "😙",
    "😚",
    "😛",
    "😜",
    "😝",
    "😞",
    "😟",
    "😠",
    "😡",
    "😢",
    "😣",
    "😤",
    "😥",
    "😦",
    "😧",
    "😨",
    "😩",
    "😪",
    "😫",
    "😬",
    "😭",
    "😮",
    "😯",
    "😰",
    "😱",
    "😲",
    "😳",
    "😴",
    "😵",
    "😶",
    "😷",
    "🙁",
    "🙂",
    "🙃",
    "🙄",
    "🤐",
    "🤑",
    "🤒",
    "🤓",
    "🤔",
    "🤕",
    "🤠",
    "🤡",
    "🤢",
    "🤣",
    "🤤",
    "🤥",
    "🤧",
    "🤨",
    "🤩",
    "🤪",
    "🤫",
    "🤬",
    "🤭",
    "🤮",
    "🤯",
    "🧐",
    "☝",
    "⛹",
    "✊",
    "✋",
    "✌",
    "✍",
    "🎅",
    "🏂",
    "🏃",
    "🏄",
    "🏇",
    "🏊",
    "🏋",
    "🏌",
    "👂",
    "👃",
    "👆",
    "👇",
    "👈",
    "👉",
    "👊",
    "👋",
    "👌",
    "👍",
    "👎",
    "👏",
    "👐",
    "👦",
    "👧",
    "👨",
    "👩",
    "👮",
    "👰",
    "👱",
    "👲",
    "👳",
    "👴",
    "👵",
    "👶",
    "👷",
    "👸",
    "👼",
    "💁",
    "💂",
    "💃",
    "💅",
    "💆",
    "💇",
    "💪",
    "🕴",
    "🕵",
    "🕺",
    "🖐",
    "🖕",
    "🖖",
    "🙅",
    "🙆",
    "🙇",
    "🙋",
    "🙌",
    "🙍",
    "🙎",
    "🙏",
    "🚣",
    "🚴",
    "🚵",
    "🚶",
    "🛀",
    "🛌",
    "🤘",
    "🤙",
    "🤚",
    "🤛",
    "🤜",
    "🤝",
    "🤞",
    "🤟",
    "🤦",
    "🤰",
    "🤱",
    "🤲",
    "🤳",
    "🤴",
    "🤵",
    "🤶",
    "🤷",
    "🤸",
    "🤹",
    "🤽",
    "🤾",
    "🧑",
    "🧒",
    "🧓",
    "🧔",
    "🧕",
    "🧖",
    "🧗",
    "🧘",
    "🧙",
    "🧚",
    "🧜",
    "🧝"
  ];

  /* WebSocket - CONFIGURACAO */
  items: any[] = [];
  private webSocketConnector: WebSocketConnector;
  private stompClient: any;

  constructor(
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private conversaService: ConversaService,
    private websocketService: WebsocketService,
    private router: Router,
    private figurinhaService: FigurinhaService,
    private imageService: ImagemService

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

    try {
      if(window.innerWidth <= 760) {
        this.retiraChat = "desabilita-temporariamente"; // GERENCIA TELAS A SEREM ABERTAS EM TELAS PEQUENAS

      }

    }catch(erro) {

    }

    this.findAllChatsbyIdUsuario(this.id);
    this.findAllFigurinhasByUsuarioId(this.id);

    this.gerenciaOpacidadeTelaDrop(false);
    this.rederizaImagemDrop(false);

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

    }else {
      console.log("RECARREGA LISTA DE CHATS");
      this.findAllChatsbyIdUsuario(this.id);

    }

  }

  /*onMessage() {
    this.items.push(this.conversa.conteudo);
  }*/

  selecionaIcone(icone: string) {

    if(this.conversa.conteudo == undefined) {
      this.conversa.conteudo = icone;

    }else {
      this.conversa.conteudo = this.conversa.conteudo + icone;

    }

  }

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
    try {
      if(window.innerWidth <= 760) {
        if(this.retiraChat.length > 0) {
          this.retiraChat = "";
          this.retiraUsuarios = "desabilita-temporariamente";
        }

      }

    }catch(erro) {

    }

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

  findAllFigurinhasByUsuarioId(id: number) {
    // this.listaFigurinhasDoUsuario = [];

    this.figurinhaService.getAllFigurinhasByUsuarioId(id).subscribe((resp: Figurinha[]) => {
      this.listaFigurinhasDoUsuario  = resp;

    });

    console.log("ARRAY (FIGURINHAS)");
    console.log(this.listaFigurinhasDoUsuario);
  }

  ajustaMensagem(idUsuarioConversa: number, idUsuario: number) {

    if(idUsuarioConversa == idUsuario) {
      this.statusMensagem = "direita";
    }else {
      this.statusMensagem = "esquerda";
    }

    /* DESCE O SCROLL DO CHAT ATE O FINAL DA TELA */
    window.document.querySelector('#chat-conversa-id')?.scrollBy(800, 1300);

    return this.statusMensagem;
  }

  ajustaMensagemFigurinha(idUsuarioConversa: number, idUsuario: number) {

    if(idUsuarioConversa == idUsuario) {
      this.statusMensagem = "direita-figurinha";
    }else {
      this.statusMensagem = "esquerda-figurinha";
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

          console.log('Mensagens carregadas');

        }, () => {
          console.log('Ocorreu um erro ao carregar as mensagens');

        });

        this.chatService.findByIdChat(idChat).subscribe((resp: Chat) => {
          /*resp.conversas.map(item => {
            item.conteudo = atob(item.conteudo); // DESCRIPTOGRAFA DADOS
          });*/

          this.conversaMemoria.chat = resp;

          console.log('Chat carregado');

        }, () => {
          console.log('Ocorreu um erro ao carregar o chat');

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

        console.log('Chat carregado');

      }, () => {
        console.log('Ocorreu um erro ao carregar o chat');

      });

      setTimeout(() => {
        this.start();

      }, 1);

      if(this.habilitaModalEmojiEfigurinha) {
        this.expandirFigurinhas(); // FECHA A TELA EXPANDIDA CASO ESTEJA ABERTA

      }

    }catch(erro) {
      console.log(erro);
    }

  }

  adicionarItemListaFigurinha(idUsuario: number, idChat: number, img: string) {

    try {

      this.usuarioConversa.id = idUsuario;
      this.chatConversa.id = idChat;

      this.conversa.usuario = this.usuarioConversa;
      this.conversa.conteudo = "img";
      this.conversa.img = img;
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

      this.expandirFigurinhas();

    }catch(erro) {
      console.log(erro);
    }

  }

  gerenciaChatOuGrupo() {
    this.itemChat = !this.itemChat;
    this.itemGrupo = !this.itemGrupo;

  }

  apresentaUsuarios(nomeChat: string) {

    console.log("ABRIR NOVO CHAT");

    this.voltarUsuarios(); // AJUSTA TELAS PARA OTIMIZACAO DE CSS

    this.chat = new Chat();

    this.contadorDigitos = nomeChat.length; // ARMAZENA A QTD DE CARACTERES DIGITADOS PARA O NOME DO GRUPO

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
      this.imgConversaUsuario = environment.imgGrupo;

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

  apresentaUsuariosParaGrupo() {

    this.contadorTentativas = this.contadorTentativas + 1

    if(this.contadorDigitos == 0 || this.contadorTentativas > 1) {
      alert('Voce precisa dar um nome ao grupo.');

      this.gerenciaChatOuGrupo();

    }else {
      this.voltarUsuarios(); // AJUSTA TELAS PARA OTIMIZACAO DE CSS

      this.apresentaUsuario = "remove-block";
      this.addUsuarioChatClass = "add-usuario-chat";
      this.removeListaUsuariosGrupo = "";

      this.nomeChat = "Usuarios para o grupo: ";
      this.imgConversaUsuario = environment.imgGrupo;

      this.findAllUsuariosConversa();

      this.inicioChat = "remove-inicio-chat";

    }

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

    this.contadorDigitos = 0; // ZERA A VARIAVEL DE CONTRLE DE BOTAO, APOS TER CRIADO UM GRUPO
    this.contadorTentativas = 0; // ZERA A VARIAVEL DE CONTRLE DE BOTAO, APOS TER CRIADO UM GRUPO

    //this.novoChat.img = usuario.img;
    this.novoChat.img = "https://i0.wp.com/emotioncard.com.br/wp-content/uploads/2016/05/perfil-whatsapp.jpg?fit=600%2C600&ssl=1";
    // this.novoChat.tipo = "grupo";

    if(this.itemChat) {
      this.novoChat.tipo = "chat";

    }else {
      this.novoChat.tipo = "grupo";

    }

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

    setTimeout(() => {
      this.start();

    }, 2000);

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

    this.voltarUsuarios(); // AJUSTA TELAS PARA OTIMIZACAO DE CSS

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
        this.imgConversaUsuario = environment.imgGrupo;

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

  voltarUsuarios() {
    try {
      if(window.innerWidth <= 760) {
        if(this.retiraChat.length == 0) {
          this.retiraUsuarios = "";
          this.retiraChat = "desabilita-temporariamente";

        }else {
          this.retiraChat = "";
          this.retiraUsuarios = "desabilita-temporariamente";

        }

      }

    }catch(erro) {

    }

  }

  expandirFigurinhas() {

    if(this.abreCampoParaVisualizarFigurinhas == "expande-figurinhas") {
      this.abreCampoParaVisualizarFigurinhas = "";
      this.habilitaModalEmojiEfigurinha = false;

    }else {
      this.abreCampoParaVisualizarFigurinhas = "expande-figurinhas";
      this.habilitaModalEmojiEfigurinha = true;

      this.gerenciaModalAberto('imoji');

    }

  }

  gerenciaModalAberto(item: string) {
    this.renderizaItem = item

    if(item == 'imoji') {
      this.ajustaCorIconeFigurinha = '';
      this.ajustaCorIconeEmoji = 'ajusta-cor-icone';
      this.ajustaCorIconeAddFigurinha = '';

    }else if(item == 'figurinha') {
      this.findAllFigurinhasByUsuarioId(this.id);

      this.ajustaCorIconeFigurinha = 'ajusta-cor-icone';
      this.ajustaCorIconeEmoji = '';
      this.ajustaCorIconeAddFigurinha = '';

    }else {
      this.ajustaCorIconeFigurinha = '';
      this.ajustaCorIconeEmoji = '';
      this.ajustaCorIconeAddFigurinha = 'ajusta-cor-icone';

    }

  }

  carregaImagem(username: string, img: string) {

    if(username == null || username == '' || img == null || img == '') {
      return '';
    }

    if(img.includes("person_perfil_vazio")) {

      return img;
    }

    // return `${this.url}/image/carregar/${username}/${img}`;
    return `${this.url}/image/carregar/${img}`;
  }

  dropHandler(ev: any) {
    console.log('File(s) dropped');

    this.gerenciaOpacidadeTelaDrop(false);
    this.rederizaImagemDrop(true);

    // Impedir o comportamento padrão (impedir que o arquivo seja aberto)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use a interface DataTransferItemList para acessar o (s) arquivo (s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // Se os itens soltos não forem arquivos, rejeite-os
        if (ev.dataTransfer.items[i].kind === 'file') {
          // var file = ev.dataTransfer.items[i].getAsFile();
          this.file = ev.dataTransfer.items[i].getAsFile();
          // console.log('... file[' + i + '].name = ' + file.name);
          console.log('... file[' + i + '].name = ' + this.file.name);

          this.processFile(ev.dataTransfer); // PROCESSA A IMAGEM NO SERVIDOR

        }
      }
    } else {
      // Use a interface DataTransfer para acessar o (s) arquivo (s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      }
    }
  }

  dragOverHandler(ev: any) {
    console.log('File(s) in drop zone');

    this.gerenciaOpacidadeTelaDrop(true);

    // Impedir o comportamento padrão (impedir que o arquivo seja aberto)
    ev.preventDefault();

  }

  gerenciaOpacidadeTelaDrop(estadoDrop: boolean) {

    if(estadoDrop) {
      window.document.querySelector('.drop_zone')?.setAttribute('style', 'opacity: 1; width: 100%;');
      window.document.querySelector('.fundo-drop')?.setAttribute('style', 'display: block;');

    }else {
      window.document.querySelector('.drop_zone')?.setAttribute('style', 'opacity: 0; width: 50%;');
      window.document.querySelector('.fundo-drop')?.setAttribute('style', 'display: none;');

    }

  }

  rederizaImagemDrop(estadoDrop: boolean) {
    if(estadoDrop) {
      window.document.querySelector('.renderiza')?.setAttribute('style', 'display: block;');
      window.document.querySelector('.fundo-drop')?.setAttribute('style', 'display: block;');

    }else {
      window.document.querySelector('.renderiza')?.setAttribute('style', 'display: none;');
      window.document.querySelector('.fundo-drop')?.setAttribute('style', 'display: none;');

    }

  }

  adicionarItemListaPortagemComImg(idUsuario: number, idChat: number) {

    try {

      this.usuarioConversa.id = idUsuario;
      this.chatConversa.id = idChat;

      this.conversa.usuario = this.usuarioConversa;
      this.conversa.chat = this.chatConversa;
      this.conversa.conteudo = this.conteudoConversa;

      console.log("CONVERSA ENVIADA: ");
      console.log(this.conversa);

      this.conversaService.postConversa(this.conversa).subscribe((resp: Conversa) => {
        console.log('Conversa enviada com sucesso.');

        this.rederizaImagemDrop(false);

        setTimeout(() => {
          this.start();

        }, 500);

        this.conversa = new Conversa();

      }, erro => {
        console.log('Ocorreu um erro no envio da conversa.');

      });

    }catch(erro) {
      console.log(erro);
    }

  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    this.viewFileImg(imageInput.files);

      reader.addEventListener('load', (event: any) => {

        this.selectedFile = new ImageSnippet(event.target.result, file);

        this.selectedFile.pending = true;

        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (res) => {
            console.log(res);

            this.conversa.img = `${environment.username}/${environment.nomeUplaodImagem}`;
            this.conversa.conteudoImg = `${environment.username}/${environment.nomeUplaodImagem}`;

            this.imgRenderizada = `${environment.server}${environment.port}/image/carregar/${this.conversa.conteudoImg}`

          },
          (err) => {
            console.log(err);

          })
      });

      reader.readAsDataURL(file);

  }

  viewFileImg(file: any) { //Angular 11, for stricter type
		if(!file[0] || file[0].length == 0) {
			this.msg = 'You must select an image';
			return;
		}

		var mimeType = file[0].type;

		if (mimeType.match(/image\/*/) == null) {
			this.msg = "Only images are supported";
			return;
		}

		var reader = new FileReader();
		reader.readAsDataURL(file[0]);

		reader.onload = (_event) => {
			this.msg = "";
			this.urlImg = reader.result;
		}
	}

}
