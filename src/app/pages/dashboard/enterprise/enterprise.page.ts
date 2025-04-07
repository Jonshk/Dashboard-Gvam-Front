import { Component } from '@angular/core';
import { EnterpriseService } from '../../../core/services/enterprise/enterprise.service';
import { Enterprise } from '../../../core/models/response/enterprise-response.model';
import { Response } from '../../../core/models/response/response.model';
import { SignUpUrl } from '../../../core/models/response/sign-up-url.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateEnterprise } from '../../../core/models/request/create-enterprise.model';
import { Router } from '@angular/router';
import { LoadingService } from '../../../core/services/loading/loading.service';

@Component({
  selector: 'app-enterprise',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './enterprise.page.html',
  styleUrl: './enterprise.page.scss',
})
export class EnterprisePage {
  signUpUrl: string = '';
  private signUpUrlName: string = '';
  enterpriseRegisterForm = new FormGroup({
    token: new FormControl('', [Validators.required]),
  });

  constructor(
    private enterpriseService: EnterpriseService,
    private router: Router,
    readonly loadingService: LoadingService,
  ) {}

  signUp() {
    this.loadingService.setLoading();
    this.enterpriseService.signUp().subscribe({
      next: ({ data }: Response<SignUpUrl>) => {
        this.signUpUrl = data.url;
        this.signUpUrlName = data.name;
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });
  }

  createEnterprise() {
    if (this.enterpriseRegisterForm.invalid) return;

    this.loadingService.setLoading();

    const createEnterprise: CreateEnterprise = {
      signupUrlName: this.signUpUrlName,
      enterpriseToken: this.enterpriseRegisterForm.value.token!,
    };

    this.enterpriseService.create(createEnterprise).subscribe({
      next: ({ data }: Response<Enterprise>) => {
        this.enterpriseService.setEnterpriseId(data.enterpriseId);
        this.router.navigate(['/groups'], { replaceUrl: true });
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });
  }
}
