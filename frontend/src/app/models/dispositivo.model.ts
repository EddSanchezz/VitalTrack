// Matches backend 'dispositivo' table
export interface Dispositivo {
  id?: number;
  usuario_id: number;
  serial: string;
  marca?: string;
  modelo?: string;
  fecha_vinculacion?: string; // ISO date
}
