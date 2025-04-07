import { Component, effect, inject, input, output } from '@angular/core';
import { DeviceUser } from '../../../../../core/models/response/device-user.model';
import { UserService } from '../../../../../core/services/user/user.service';
import { LoadingService } from '../../../../../core/services/loading/loading.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateDeviceUserRequest } from '../../../../../core/models/request/create-device-user-request.model';
import { Response } from '../../../../../core/models/response/response.model';
import { PolicyService } from '../../../../../core/services/policy/policy.service';
import { Policy } from '../../../../../core/models/response/policy.model';

@Component({
  selector: 'app-user-selection-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-selection-form.component.html',
  styleUrl: './user-selection-form.component.scss',
})
export class UserSelectionFormComponent {
  readonly groupId = input.required<number>();
  readonly isVisible = input.required<boolean>();
  readonly groupUsers = input.required<DeviceUser[]>();
  readonly editUser = input<DeviceUser | null>(null);
  policies: Policy[] = [];
  users: DeviceUser[] = [];

  user = output<DeviceUser>();

  private userService = inject(UserService);
  private policyService = inject(PolicyService);
  readonly loadingService = inject(LoadingService);

  private defaultFormValues = {
    user: '',
  };

  userForm = new FormGroup({
    user: new FormControl(this.defaultFormValues.user, [Validators.required]),
  });

  private getUsers = effect(async () => {
    //list all users
    await this.userService.list().subscribe({
      next: ({ data }: Response<DeviceUser[]>) => {
        this.users = data;
        //Exclude those that are already in the group
        var newUsers: DeviceUser[] = [];

        this.users.forEach((user) => {
          if (
            !this.groupUsers().some((e) => user.deviceUserId === e.deviceUserId)
          ) {
            newUsers.push(user);
          }
        });

        this.users = newUsers;
      },
      error: (err: any) => {
        console.error('error:', err);
      },
    });
  });

  private setUserForm = effect(() => {
    this.resetForm();
  });

  private resetForm() {
    this.userForm.reset(this.defaultFormValues);
  }

  private resetOnHide = effect(() => {
    if (!this.isVisible()) {
      this.resetForm();
    }
  });

  onSubmit() {
    if (this.userForm.invalid) return;

    this.loadingService.showLoading();
    //We get the selected user
    const userToAdd = this.users.find(
      (el: DeviceUser) => el.email === this.userForm.value.user,
    );

    //this.AddDeviceUser(this.userForm.value.user)
  }

  private AddDeviceUser(newDeviceUser: CreateDeviceUserRequest) {
    this.userService.create(newDeviceUser).subscribe({
      next: ({ data }: Response<DeviceUser>) => {
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
