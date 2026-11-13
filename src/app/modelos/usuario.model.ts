export interface Usuario {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  correo: string;
  usuario: string;
  password: string;
  descripcion?: string;
  imagenPerfil?: File | null;
  perfil: string;
}

export interface UsuarioRespuesta {
  _id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  correo: string;
  usuario: string;
  descripcion?: string;
  imagenPerfil?: string;
  perfil: string;
}

export interface LoginRespuesta {
  access_token: string;
  usuario: UsuarioRespuesta;
}
