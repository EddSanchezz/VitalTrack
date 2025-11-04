import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilesService, Perfil } from '../services/perfiles.service';

@Component({
	selector: 'vt-perfiles',
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
		<div class="fade-in">
			<div class="flex justify-between items-center mb-4">
				<h1>👥 Perfiles</h1>
				<button class="btn btn-primary" (click)="reset()" *ngIf="form.id">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="12" y1="5" x2="12" y2="19"/>
						<line x1="5" y1="12" x2="19" y2="12"/>
					</svg>
					Nuevo Perfil
				</button>
			</div>

			<div class="card mb-4">
				<h3 style="margin-bottom: 1.5rem;">{{ form.id ? '✏️ Editar Perfil' : '➕ Crear Perfil' }}</h3>
				<form (ngSubmit)="save()">
					<div class="form-group">
						<label class="form-label">ID de Usuario</label>
						<input class="form-input" type="number" name="usuario_id" [(ngModel)]="form.usuario_id" placeholder="ID del usuario" required />
					</div>

					<div class="form-group">
						<label class="form-label">Objetivo</label>
						<input class="form-input" name="objetivo" [(ngModel)]="form.objetivo" placeholder="Ej: Perder peso, ganar masa muscular" />
					</div>

					<div class="form-group">
						<label class="form-label">Sexo</label>
						<select class="form-select" name="sexo" [(ngModel)]="form.sexo">
							<option value="M">Masculino</option>
							<option value="F">Femenino</option>
							<option value="O">Otro</option>
						</select>
					</div>

					<div class="form-group">
						<label class="form-label">Altura (cm)</label>
						<input class="form-input" type="number" name="altura" [(ngModel)]="form.altura" placeholder="Ej: 175" />
					</div>

					<div class="form-group">
						<label class="form-label">Estado</label>
						<select class="form-select" name="estado" [(ngModel)]="form.estado">
							<option value="activo">Activo</option>
							<option value="inactivo">Inactivo</option>
						</select>
					</div>

					<div class="flex gap-2">
						<button type="submit" class="btn btn-primary">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
								<polyline points="17 21 17 13 7 13 7 21"/>
								<polyline points="7 3 7 8 15 8"/>
							</svg>
							{{ form.id ? 'Actualizar' : 'Crear' }}
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
							<th>Sexo</th>
							<th>Altura</th>
							<th>Estado</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						<tr *ngFor="let p of items">
							<td><span class="badge badge-primary">#{{p.id}}</span></td>
							<td>Usuario #{{p.usuario_id}}</td>
							<td>{{p.sexo}}</td>
							<td>{{p.altura}} cm</td>
							<td>
								<span class="badge badge-success" *ngIf="p.estado === 'activo'">✓ Activo</span>
								<span class="badge badge-warning" *ngIf="p.estado !== 'activo'">⏸ Inactivo</span>
							</td>
							<td>
								<div class="flex gap-2">
									<button class="btn btn-sm btn-secondary" (click)="edit(p)">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
										</svg>
										Editar
									</button>
									<button class="btn btn-sm btn-danger" (click)="remove(p)">
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
export default class PerfilesListComponent implements OnInit {
	items: Perfil[] = [];
	form: any = { id: null, usuario_id: 1, objetivo: '', sexo: 'M', altura: null, estado: 'activo' };
	constructor(private svc: PerfilesService) {}
	ngOnInit() { this.load(); }
	load() { this.svc.list().subscribe(d => this.items = d); }
	edit(p: Perfil) { this.form = { ...p }; }
	reset() { this.form = { id: null, usuario_id: 1, objetivo: '', sexo: 'M', altura: null, estado: 'activo' }; }
	save() {
		const payload = { ...this.form };
		if (payload.id) {
			this.svc.update(payload.id, payload).subscribe(() => { this.reset(); this.load(); });
		} else {
			this.svc.create(payload).subscribe(() => { this.reset(); this.load(); });
		}
	}
	remove(p: Perfil) { if (confirm('Eliminar?')) this.svc.remove(p.id!).subscribe(() => this.load()); }
}

