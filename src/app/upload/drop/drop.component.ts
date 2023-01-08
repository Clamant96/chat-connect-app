import { HomeComponent } from './../../home/home.component';
import { ImagemService } from './../../service/imagem.service';
import { ConversaService } from './../../service/conversa.service';
import { Usuario } from './../../model/Usuario';
import { Chat } from './../../model/Chat';
import { Conversa } from './../../model/Conversa';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-drop',
  templateUrl: './drop.component.html',
  styleUrls: ['./drop.component.css']
})
export class DropComponent implements OnInit {

  @Input() idUsuario = 0;
  @Input() idChat = 0;

  selectedFile: ImageSnippet;

  usuarioConversa: Usuario = new Usuario();
  chatConversa: Chat = new Chat();

  file: File;
  conversa: Conversa = new Conversa();

  img: string = "" // IMG CARREGADA PARA POSTAGEM

  url: any;
  msg: string = "";

  imgRenderizada: string = "";

  constructor(
    private conversaService: ConversaService,
    private imageService: ImagemService

  ) { }

  ngOnInit() {
    window.scroll(0,0);

    this.gerenciaOpacidadeTelaDrop(false);
    this.rederizaImagemDrop(false);

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

    }else {
      window.document.querySelector('.drop_zone')?.setAttribute('style', 'opacity: 0; width: 50%;');

    }

  }

  rederizaImagemDrop(estadoDrop: boolean) {
    if(estadoDrop) {
      window.document.querySelector('.renderiza')?.setAttribute('style', 'display: block;');

    }else {
      window.document.querySelector('.renderiza')?.setAttribute('style', 'display: none;');

    }

  }

  adicionarItemLista(idUsuario: number, idChat: number) {

    try {

      this.usuarioConversa.id = idUsuario;
      this.chatConversa.id = idChat;

      this.conversa.usuario = this.usuarioConversa;
      this.conversa.chat = this.chatConversa;

      console.log("CONVERSA ENVIADA: ");
      console.log(this.conversa);

      this.conversaService.postConversa(this.conversa).subscribe((resp: Conversa) => {
        console.log('Conversa enviada com sucesso.');

        this.rederizaImagemDrop(false);

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
			this.url = reader.result;
		}
	}

}
