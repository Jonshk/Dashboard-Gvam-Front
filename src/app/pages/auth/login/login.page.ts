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
import { EnterpriseService } from '../../../core/services/enterprise/enterprise.service';
import { Enterprise } from '../../../core/models/response/enterprise-response.model';
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
    private enterpriseService: EnterpriseService,
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
  
        this.enterpriseService.list().subscribe({
          next: ({ data }: Response<Enterprise[]>) => {
            if (data.length > 0) {
              this.enterpriseService.setEnterpriseId(data[0].enterpriseId);
              this.router.navigate(['/groups'], { replaceUrl: true });
            } else {
              this.enterpriseService.setEnterpriseId(false);
              this.router.navigate(['/enterprises'], { replaceUrl: true });
            }
            this.loadingService.dismissLoading();
          },
          error: (err: any) => {
            this.loadingService.dismissLoading();
            console.error('error:', err);
          },
        });
      },
      error: (err: any) => {
        this.loadingService.dismissLoading();
        console.error('error:', err);
      },
    });
  }
  }
