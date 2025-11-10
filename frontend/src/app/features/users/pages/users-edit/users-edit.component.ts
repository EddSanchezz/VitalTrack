import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-edit',
  standalone:false,
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.css']
})
export class UsersEditComponent implements OnInit {
  form!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private svc: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cedula: [''],
      consentimiento_privacidad: [true]
    });

    if (this.id) {
      this.svc.get(this.id).subscribe({
        next: (user: User) => this.form.patchValue({
          nombre: user.nombre,
          email: user.email,
          cedula: user.cedula ?? '',
          consentimiento_privacidad: user.consentimiento_privacidad ?? true
        }),
        error: (err: any) => console.error('Error loading user:', err)
      });
    }
  }

  save(): void {
    const payload = this.form.value;
    if (this.id) {
      this.svc.update(this.id, payload).subscribe(() => this.router.navigate(['/home/usuarios']));
    } else {
      this.svc.create(payload).subscribe(() => this.router.navigate(['/home/usuarios']));
    }
  }
}
