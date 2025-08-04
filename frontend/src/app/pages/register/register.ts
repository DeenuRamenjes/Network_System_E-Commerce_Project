import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  form = {
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    repassword: ''
  };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    if (this.form.password !== this.form.repassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.auth.register(
      this.form.username,
      this.form.name,
      this.form.email,
      this.form.phone,
      this.form.password
    ).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => this.error = err.error?.message || 'Registration failed'
    });
  }
}
