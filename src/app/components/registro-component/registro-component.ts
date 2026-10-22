import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-registro-component',
  styleUrl: './registro-component.css',
  templateUrl: './registro-component.html',
})
export class RegistroComponent {
  nombre = '';
  apellido = '';
  correo = '';
  edad = '';
  usuario = '';
  password = '';
  mensaje = '';

  registrarUsuario(formulario: NgForm) {}
}
