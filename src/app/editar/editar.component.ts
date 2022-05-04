import { Usuario } from './../model/Usuario';
import { UsuarioService } from './../service/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  usuario: Usuario = new Usuario();

  id: number = 0;

  confirmarSenha: string = "";

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    window.scroll(0, 0);

    if(localStorage.getItem('token') == null) {
      this.router.navigate(['/login']);

    }

    this.id = this.route.snapshot.params['id'];
    this.findByIdUsuario(this.id);
  }

  findByIdUsuario(id: number) {

    this.usuarioService.findByIdUsuario(id).subscribe((resp: Usuario) => {
      this.usuario = resp;

    });

  }

  /* VERIFICA SE A SENHA CRIADA E MESMA DE CONFIRME SENHA */
  confirmeSenha(event: any) {
    /* ATRIBUI O DADO VINDO DO HTML POR MEIO DO [(ngModel)] A VARIAVEL CRIADA */
    this.confirmarSenha = event.target.value;

  }

  atualizar() {

    /* VERIFICA SE AS SENHAS DIGITADAS, SAO IGUAIS */
    if(this.usuario.password != this.confirmarSenha) {
      /* INFORMA UM ALERTA AO USUARIO */
      alert('As senhas estao incorretas!');

    }else {
      /* CHAMA O METODO CADASTRAR CRIADO NO NOSSO SERVICE */
      /* subscribe ==> CONVERTE UM ARQUIVO TypeScript EM UM ARQUIVO JSON/JavaScript */
      /* ARMAZENA OS DADOS DENTRO DE UM ATRIBUTO TEMPORARIO CHAMADO resp */
      this.usuarioService.atualizar(this.usuario).subscribe((resp: Usuario) => {
        /* POR SUA VEZ ATRIBUI OS DADOS DE resp AO USUARIO DENTRO DA BASE DE DADOS*/
        this.usuario = resp;
        /* REDIRECIONA O USUARIO A PAGINA DE login APOS O CADASTRO TER SIDO REALIZADO COM SUCESSO */
        this.router.navigate(['/login']);
        /* INFORMA UM ALERTA AO USUARIO DE CADASTRO BEM SUCEDIDO */
        alert('Usuario atualizado com sucesso!');

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
