import { Router } from '@angular/router';
import { UsuarioService } from './../service/usuario.service';
import { UsuarioLogin } from './../model/UsuarioLogin';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuarioLogin: UsuarioLogin = new UsuarioLogin();

  constructor(
    private usuarioService: UsuarioService,
    private router: Router

  ) { }

  ngOnInit() {
    window.scroll(0,0);

  }

  logar() {
    this.usuarioService.login(this.usuarioLogin).subscribe((resp: UsuarioLogin) => {
      this.usuarioLogin = resp;

      environment.id = this.usuarioLogin.id;
      environment.username = this.usuarioLogin.username;
      environment.password = this.usuarioLogin.password;
      environment.token = this.usuarioLogin.token;
      environment.img = this.usuarioLogin.img;

      console.log(environment.id);
      console.log(environment.username);
      console.log(environment.password);
      console.log(environment.token);
      console.log(environment.img);


      /* ARMAZENA O TOKEN DO USUARIO NO LOCAL STORAGE */
      localStorage.setItem('token', environment.token);

      this.router.navigate(['/home']);

    }, erro => {
      if(erro.status == 500) {
        alert('Usuario ou senha estao incorretos!');

      }

    });

  }

}
