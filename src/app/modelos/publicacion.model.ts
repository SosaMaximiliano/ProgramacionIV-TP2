import { UsuarioRespuesta } from './usuario.model';

export interface Publicacion {
  titulo: string;
  descripcion: string;
  imagen?: File | null;
  usuario: string;
  fecha: string;
  likes: string[];
  estaActivo: boolean;
}

export interface PublicacionRespuesta {
  _id: string;
  titulo: string;
  descripcion: string;
  imagenPublicacion?: string;
  usuario: Pick<UsuarioRespuesta, '_id' | 'usuario' | 'nombre' | 'apellido' | 'imagenPerfil'>;
  fecha: string;
  likes: string[];
  estaActivo: boolean;
}
