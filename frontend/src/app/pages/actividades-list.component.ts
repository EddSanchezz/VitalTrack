import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadesService, Actividad } from '../services/actividades.service';

@Component({
	selector: 'vt-actividades',
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
		<div class="fade-in">
			<div class="flex justify-between items-center mb-4">
				<h1>⚡ Actividades</h1>
				<button class="btn btn-primary" (click)="reset()" *ngIf="form.id">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="12" y1="5" x2="12" y2="19"/>
						<line x1="5" y1="12" x2="19" y2="12"/>
					</svg>
					Nueva Actividad
				</button>
			</div>

			<div class="card mb-4">
				<h3 style="margin-bottom: 1.5rem;">{{ form.id ? '✏️ Editar Actividad' : '➕ Registrar Actividad' }}</h3>
				<form (ngSubmit)="save()">
					<div class="form-group">
						<label class="form-label">ID de Usuario</label>
						<input class="form-input" type="number" [(ngModel)]="form.usuario_id" name="usuario_id" placeholder="ID del usuario" required />
					</div>

					<div class="form-group">
						<label class="form-label">Tipo de Actividad</label>
						<select class="form-select" [(ngModel)]="form.tipo" name="tipo">
							<option value="caminar">🚶 Caminar</option>
							<option value="correr">🏃 Correr</option>
							<option value="ciclismo">🚴 Ciclismo</option>
							<option value="natacion">🏊 Natación</option>
							<option value="yoga">🧘 Yoga</option>
							<option value="gimnasio">💪 Gimnasio</option>
							<option value="otro">📋 Otro</option>
						</select>
					</div>

					<div class="form-group">
						<label class="form-label">Hora de Inicio</label>
						<input class="form-input" type="datetime-local" [(ngModel)]="form.hora_inicio" name="hora_inicio" />
					</div>

					<div class="form-group">
						<label class="form-label">Hora de Fin</label>
						<input class="form-input" type="datetime-local" [(ngModel)]="form.hora_fin" name="hora_fin" />
					</div>

					<div class="form-group">
						<label class="form-label">Duración (segundos)</label>
						<input class="form-input" type="number" [(ngModel)]="form.duracion_segundos" name="duracion_segundos" placeholder="Ej: 3600 (1 hora)" />
					</div>

					<div class="flex gap-2">
						<button type="submit" class="btn btn-primary">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
								<polyline points="17 21 17 13 7 13 7 21"/>
								<polyline points="7 3 7 8 15 8"/>
							</svg>
							{{ form.id ? 'Actualizar' : 'Registrar' }}
						</button>
						<button type="button" class="btn btn-secondary" (click)="reset()" *ngIf="form.id">Cancelar</button>
					</div>
				</form>
			</div>

			<div class="table-container">
				<table class="table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Usuario</th>
							<th>Tipo</th>
							<th>Inicio</th>
							<th>Fin</th>
							<th>Duración</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						<tr *ngFor="let a of items">
							<td><span class="badge badge-primary">#{{a.id}}</span></td>
							<td>Usuario #{{a.usuario_id}}</td>
							<td>
								<span class="badge" style="background: var(--primary-100); color: var(--primary-700);">
									{{a.tipo}}
								</span>
							</td>
							<td>{{a.hora_inicio ? (a.hora_inicio | date:'short') : '-'}}</td>
							<td>{{a.hora_fin ? (a.hora_fin | date:'short') : '-'}}</td>
							<td>
								<span *ngIf="a.duracion_segundos">
									{{formatDuration(a.duracion_segundos)}}
								</span>
								<span *ngIf="!a.duracion_segundos">-</span>
							</td>
							<td>
								<div class="flex gap-2">
									<button class="btn btn-sm btn-secondary" (click)="edit(a)">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
										</svg>
										Editar
									</button>
									<button class="btn btn-sm btn-danger" (click)="remove(a)">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<polyline points="3 6 5 6 21 6"/>
											<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
										</svg>
										Eliminar
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`
})
export default class ActividadesListComponent implements OnInit {
	items: Actividad[] = [];
	form: any = { id: null, usuario_id: 1, tipo: 'caminar', hora_inicio: '', hora_fin: '', duracion_segundos: null };
	constructor(private svc: ActividadesService) {}
	ngOnInit() { this.load(); }
	load() { this.svc.list().subscribe(d => this.items = d); }
	edit(x: Actividad) { this.form = { ...x }; }
	reset() { this.form = { id: null, usuario_id: 1, tipo: 'caminar', hora_inicio: '', hora_fin: '', duracion_segundos: null }; }
	save() {
		const p = { ...this.form };
		if (p.id) this.svc.update(p.id, p).subscribe(() => { this.reset(); this.load(); });
		else this.svc.create(p).subscribe(() => { this.reset(); this.load(); });
	}
	remove(x: Actividad) { if (confirm('Eliminar?')) this.svc.remove(x.id!).subscribe(() => this.load()); }

	formatDuration(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) return `${hours}h ${minutes}m`;
		if (minutes > 0) return `${minutes}m ${secs}s`;
		return `${secs}s`;
	}
}

