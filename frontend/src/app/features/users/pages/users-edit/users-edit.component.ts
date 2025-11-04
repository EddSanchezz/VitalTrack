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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sport: ['', Validators.required]
    });

    if (this.id) {
      this.svc.get(this.id).subscribe(user => this.form.patchValue(user));
    }
  }

  save(): void {
    const user = this.form.value as User;
    if (this.id) {
      this.svc.update(this.id, user).subscribe(() => this.router.navigate(['/']));
    } else {
      this.svc.create(user).subscribe(() => this.router.navigate(['/']));
    }
  }
}
