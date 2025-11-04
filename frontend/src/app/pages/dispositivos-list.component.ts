import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DispositivosService, Dispositivo } from '../services/dispositivos.service';

@Component({
	selector: 'vt-dispositivos',
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
		<div class="fade-in">
			<div class="flex justify-between items-center mb-4">
				<h1>📱 Dispositivos</h1>
				<button class="btn btn-primary" (click)="reset()" *ngIf="form.id">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="12" y1="5" x2="12" y2="19"/>
						<line x1="5" y1="12" x2="19" y2="12"/>
					</svg>
					Nuevo Dispositivo
				</button>
			</div>

			<div class="card mb-4">
				<h3 style="margin-bottom: 1.5rem;">{{ form.id ? '✏️ Editar Dispositivo' : '➕ Registrar Dispositivo' }}</h3>
				<form (ngSubmit)="save()">
					<div class="form-group">
						<label class="form-label">ID de Usuario</label>
						<input class="form-input" type="number" [(ngModel)]="form.usuario_id" name="usuario_id" placeholder="ID del usuario" required />
					</div>

					<div class="form-group">
						<label class="form-label">Número de Serie</label>
						<input class="form-input" [(ngModel)]="form.serial" name="serial" placeholder="Ej: SN123456789" required />
					</div>

					<div class="form-group">
						<label class="form-label">Marca</label>
						<input class="form-input" [(ngModel)]="form.marca" name="marca" placeholder="Ej: Fitbit, Garmin, Apple" />
					</div>

					<div class="form-group">
						<label class="form-label">Modelo</label>
						<input class="form-input" [(ngModel)]="form.modelo" name="modelo" placeholder="Ej: Charge 5, Forerunner 245" />
					</div>

					<div class="form-group">
						<label class="form-label">Fecha de Vinculación</label>
						<input class="form-input" type="date" [(ngModel)]="form.fecha_vinculacion" name="fecha_vinculacion" />
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
							<th>Serial</th>
							<th>Marca/Modelo</th>
							<th>Fecha Vinculación</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						<tr *ngFor="let d of items">
							<td><span class="badge badge-primary">#{{d.id}}</span></td>
							<td>Usuario #{{d.usuario_id}}</td>
							<td><code style="background: var(--gray-100); padding: 2px 8px; border-radius: 4px; font-size: 0.85rem;">{{d.serial}}</code></td>
							<td>{{d.marca}} {{d.modelo}}</td>
							<td>{{d.fecha_vinculacion || 'Sin fecha'}}</td>
							<td>
								<div class="flex gap-2">
									<button class="btn btn-sm btn-secondary" (click)="edit(d)">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
										</svg>
										Editar
									</button>
									<button class="btn btn-sm btn-danger" (click)="remove(d)">
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
export default class DispositivosListComponent implements OnInit {
	items: Dispositivo[] = [];
	form: any = { id: null, usuario_id: 1, serial: '', marca: '', modelo: '', fecha_vinculacion: '' };
	constructor(private svc: DispositivosService) {}
	ngOnInit() { this.load(); }
	load() { this.svc.list().subscribe(d => this.items = d); }
	edit(x: Dispositivo) { this.form = { ...x }; }
	reset() { this.form = { id: null, usuario_id: 1, serial: '', marca: '', modelo: '', fecha_vinculacion: '' }; }
	save() {
		const p = { ...this.form };
		if (p.id) this.svc.update(p.id, p).subscribe(() => { this.reset(); this.load(); });
		else this.svc.create(p).subscribe(() => { this.reset(); this.load(); });
	}
	remove(x: Dispositivo) { if (confirm('Eliminar?')) this.svc.remove(x.id!).subscribe(() => this.load()); }
}

