import { Component, effect, inject, input, output } from '@angular/core';
import { SystemUser } from '../../../../core/models/response/system-user.model';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { CustomValidators } from '../../../../shared/util/custom-validators';
import { SystemUserService } from '../../../../core/services/system-user/system-user.service';
import { CreateSystemUserRequest } from '../../../../core/models/request/create-system-user-request.model';
import { Response } from '../../../../core/models/response/response.model';

@Component({
  selector: 'app-system-users-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './system-users-form.component.html',
  styleUrl: './system-users-form.component.scss',
})
export class SystemUsersFormComponent {
  groupId() {
    throw new Error('Method not implemented.');
  }
  readonly isVisible = input.required<boolean>();
  readonly editUser = input<SystemUser | null>(null);

  user = output<SystemUser>();

  private systemUserService = inject(SystemUserService);
  readonly loadingService = inject(LoadingService);

  private defaultFormValues = {
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
  };

  userForm = new FormGroup(
    {
      name: new FormControl(this.defaultFormValues.name, [Validators.required]),
      email: new FormControl(this.defaultFormValues.email, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(this.defaultFormValues.password, [
        Validators.required,
      ]),
      repeatPassword: new FormControl(this.defaultFormValues.repeatPassword, [
        Validators.required,
      ]),
    },
    { validators: [CustomValidators.repeatPasswordValidator()] },
  );

  private setUserForm = effect(() => {
    this.resetForm();
    if (this.editUser()) {
      this.userForm.controls.name.setValue(this.editUser()!.name);
      this.userForm.controls.email.setValue(this.editUser()!.email);

      this.userForm.controls.password.removeValidators(Validators.required);
      this.userForm.controls.repeatPassword.removeValidators(
        Validators.required,
      );

      this.userForm.controls.password.setValue('');
      this.userForm.controls.repeatPassword.setValue('');
    }
  });

  private resetForm() {
    this.userForm.reset(this.defaultFormValues);
    this.userForm.controls.password.setValidators(Validators.required);
    this.userForm.controls.repeatPassword.setValidators(Validators.required);
  }

  private resetOnHide = effect(() => {
    if (!this.isVisible()) {
      this.resetForm();
    }
  });

  onSubmit() {
    if (this.userForm.invalid) return;

    this.loadingService.showLoading();

    const deviceUser: CreateSystemUserRequest = {
      name: this.userForm.value.name!,
      email: this.userForm.value.email!,
      password: this.userForm.value.password,
    };

    if (this.editUser()) {
      this.updateDeviceUser(deviceUser);
      return;
    }

    this.createDeviceUser(deviceUser);
  }

  private createDeviceUser(newSystemUser: CreateSystemUserRequest) {
    this.systemUserService.create(newSystemUser).subscribe({
      next: ({ data }: Response<SystemUser>) => {
        this.user.emit(data);
        this.resetForm();
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });
  }

  private updateDeviceUser(editedSystemUser: CreateSystemUserRequest) {
    this.systemUserService
      .patch(this.editUser()!.userId, editedSystemUser)
      .subscribe({
        next: ({ data }: Response<SystemUser>) => {
          this.user.emit(data);
          this.resetForm();
          this.loadingService.dismissLoading();
        },
        error: (err: any) => {
          console.error('error:', err);
          this.loadingService.dismissLoading();
        },
      });
  }
}
