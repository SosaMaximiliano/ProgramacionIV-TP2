import { PublicacionRespuesta } from './publicacion.model';
import { UsuarioRespuesta } from './usuario.model';

export interface Comentario {
  comentario: string;
  fecha: string;
  usuario: string;
  likes: string[];
  estaACtivo: boolean;
}

export interface ComentarioRespuesta {
  _id: string;
  comentario: string;
  fecha: string;
  usuario: Pick<UsuarioRespuesta, '_id' | 'usuario' | 'nombre' | 'apellido' | 'imagenPerfil'>;
  likes: string[];
  estaACtivo: boolean;
  modificado: boolean;
}
