import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { PublicacionesService } from '../../services/publicaciones.service';

@Component({
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  selector: 'app-publicacion-form.component',
  styleUrl: './publicacion-form.component.css',
  templateUrl: './publicacion-form.component.html',
})
export class PublicacionFormComponent {
  private fb = inject(FormBuilder);
  imagenPublicacion: File | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private publicacionesService: PublicacionesService,
    private router: Router,
  ) {}

  formPublicacion: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  async subirPublicacion() {
    if (this.formPublicacion.invalid) {
      this.formPublicacion.markAllAsTouched();
      return;
    }

    try {
      const formulario = this.formPublicacion.getRawValue();
      const datos = new FormData();
      datos.append('titulo', formulario.titulo!);
      datos.append('descripcion', formulario.descripcion!);
      if (this.imagenPublicacion) {
        datos.append('imagenPublicacion', this.imagenPublicacion);
      }
      await this.publicacionesService.crearPublicacion(datos);
      await this.router.navigate(['/publicaciones']);
    } catch (error) {
      console.log(error);
    }
  }

  seleccionarImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.imagenPublicacion = input.files?.[0] ?? null;
  }
}
