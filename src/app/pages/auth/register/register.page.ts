import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RegisterRequest } from '../../../core/models/request/register-request.model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { StoreService } from '../../../core/services/store/store.service';
import { LoginResponse } from '../../../core/models/response/login-response.model';
import { Response } from '../../../core/models/response/response.model';
import { EnterpriseService } from '../../../core/services/enterprise/enterprise.service';
import { Router, RouterModule } from '@angular/router';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { CustomValidators } from '../../../shared/util/custom-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPage {
  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      repeatPassword: new FormControl('', [Validators.required]),
    },
    { validators: CustomValidators.repeatPasswordValidator() },
  );

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    private enterpriseService: EnterpriseService,
    private router: Router,
    private loadingService: LoadingService,
  ) {}

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loadingService.setLoading();

    const registerRequest: RegisterRequest = {
      name: this.registerForm.value.name!!,
      email: this.registerForm.value.email!!,
      password: this.registerForm.value.password!!,
    };

    this.authService.register(registerRequest).subscribe({
      next: ({ data }: Response<LoginResponse>) => {
        this.storeService.save('email', data.email);
        this.authService.saveTokens(data.tokens);

        this.enterpriseService.setEnterpriseId(false);
        this.router.navigate(['/enterprises'], { replaceUrl: true });
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });
  }
}
