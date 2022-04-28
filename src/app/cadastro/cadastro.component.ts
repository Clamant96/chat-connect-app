import { UsuarioService } from './../service/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../model/Usuario';
@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  /* INSTANCIA UM NOVO USUARIO PARA SER CADASTRADO */
  usuario: Usuario = new Usuario();
  /* CRIA UM ATRIBUTO PARA ARMAZENAR A SENHA DIGITADA */
  confirmarSenha: string;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router

  ) { }

  /* QUANDO MINHA PAGINA INICIALIZAR FACA ISSO */
  ngOnInit() {
    // FAZ COM QUE O SCROLL SEMPRE FIQUE NO TOPO DA TELA AO INICIALIZAR A APLICACAO
    window.scroll(0,0)
  }

  /* VERIFICA SE A SENHA CRIADA E MESMA DE CONFIRME SENHA */
  confirmeSenha(event: any) {
    /* ATRIBUI O DADO VINDO DO HTML POR MEIO DO [(ngModel)] A VARIAVEL CRIADA */
    this.confirmarSenha = event.target.value;

  }

  cadastrar() {

    /* VERIFICA SE AS SENHAS DIGITADAS, SAO IGUAIS */
    if(this.usuario.password != this.confirmarSenha) {
      /* INFORMA UM ALERTA AO USUARIO */
      alert('As senhas estao incorretas!');

    }else {
      /* CHAMA O METODO CADASTRAR CRIADO NO NOSSO SERVICE */
      /* subscribe ==> CONVERTE UM ARQUIVO TypeScript EM UM ARQUIVO JSON/JavaScript */
      /* ARMAZENA OS DADOS DENTRO DE UM ATRIBUTO TEMPORARIO CHAMADO resp */
      this.usuarioService.cadastrar(this.usuario).subscribe((resp: Usuario) => {
        /* POR SUA VEZ ATRIBUI OS DADOS DE resp AO USUARIO DENTRO DA BASE DE DADOS*/
        this.usuario = resp;
        /* REDIRECIONA O USUARIO A PAGINA DE login APOS O CADASTRO TER SIDO REALIZADO COM SUCESSO */
        this.router.navigate(['/login']);
        /* INFORMA UM ALERTA AO USUARIO DE CADASTRO BEM SUCEDIDO */
        alert('Usuario cadastrado com sucesso!');

        /* CASO OCORRA UMA MENSAGEM DE ERRO, MOSTRA ESSE ERRO NO CONSOLE */
      }, erro => {
        console.log(erro.status);
        console.log(erro);

      });

    }

  }

  /* ANIMACAO */
  botaoCadastrarAnimacaoOver(){
    window.document.querySelector('#botaoCadastrar')?.setAttribute('style', 'background-color: #c3c3c3 !important;')

  }

  /* ANIMACAO */
  botaoCadastrarAnimacaoOut(){
    window.document.querySelector('#botaoCadastrar')?.setAttribute('style', 'background-color: var(--background-color-button) !important;')

  }

}
