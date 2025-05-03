import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LoginRequest } from '../../../core/models/request/login-request.model';
import { Response } from '../../../core/models/response/response.model';
import { LoginResponse } from '../../../core/models/response/login-response.model';
import { StoreService } from '../../../core/services/store/store.service';
import { Router, RouterModule } from '@angular/router';
import { LoadingService } from '../../../core/services/loading/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    private router: Router,
    readonly loadingService: LoadingService,
  ) {}

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loadingService.setLoading();

    const loginRequest: LoginRequest = {
      username: this.loginForm.value.username!,
      password: this.loginForm.value.password!,
    };

    this.authService.login(loginRequest).subscribe({
      next: ({ data }: Response<LoginResponse>) => {
        this.storeService.save('email', data.email);
        this.storeService.save('role', data.role);
        this.authService.saveTokens(data.tokens);

        // Redirigir directamente al dashboard después de iniciar sesión
        this.router.navigate(['/dashboard'], { replaceUrl: true });
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        this.loadingService.dismissLoading();
        console.error('error:', err);
      },
    });
  }
}
