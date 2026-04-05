import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})


export class ResetPasswordComponent implements OnInit {
  constructor(private route : ActivatedRoute, private http: HttpClient) { }

  

  token: string | null = null;
  email: string | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
    this.email = params['email'];
    this.token = params['token'];

  });

  }
  newPassword = '';
  confirmPassword = '';
  showNew = false;
  showConfirm = false;
  submitted = false;
  success = false;
  errorMessage: string | null = null;

  passwordStrength(password: string): 'weak' | 'fair' | 'strong' {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return 'weak';
    if (score <= 2) return 'fair';
    return 'strong';
  }

  onSubmit(): void {
    if (this.newPassword !== this.confirmPassword) return;
    this.errorMessage = null;

    const resetPasswordData: ResetPasswordData = {
      newPassword: this.newPassword,
      token: this.token!,
      email: this.email!
    };

    this.http.post(environment.apiUrl + 'api/account/reset-password', resetPasswordData)
      .subscribe({
        next: () => {
          this.success = true;
        },
        error: (err) => {
          this.submitted = false;
          const status = err?.status;
          const msg: string = err?.error?.message ?? err?.error ?? '';
          if (status === 400 || msg.toLowerCase().includes('invalid')) {
            this.errorMessage = 'The reset link is invalid. Please request a new one.';
          } else if (status === 410 || msg.toLowerCase().includes('expir')) {
            this.errorMessage = 'The reset link has expired. Please request a new one.';
          } else {
            this.errorMessage = 'Something went wrong. Please try again.';
          }
        }
      });
  }
}
 export interface ResetPasswordData {
  newPassword: string;
  token: string;
  email:string;
}