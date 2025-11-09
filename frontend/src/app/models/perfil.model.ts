// Matches backend 'perfil' table
export interface Perfil {
  id?: number;
  usuario_id: number;
  objetivo?: string;
  sexo?: string;
  altura?: number;
  estado?: string;
}
