// Matches backend 'actividad' table
export interface Actividad {
  id?: number;
  usuario_id: number;
  tipo?: string;
  hora_inicio?: string; // ISO datetime
  hora_fin?: string; // ISO datetime
  duracion_segundos?: number;
}
