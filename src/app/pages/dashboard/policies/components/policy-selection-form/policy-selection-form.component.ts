import { Component, effect, inject, input, output } from '@angular/core';
import { DeviceUser } from '../../../../../core/models/response/device-user.model';
import { LoadingService } from '../../../../../core/services/loading/loading.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Response } from '../../../../../core/models/response/response.model';
import { PolicyService } from '../../../../../core/services/policy/policy.service';
import { Policy } from '../../../../../core/models/response/policy.model';

@Component({
  selector: 'app-policy-selection-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './policy-selection-form.component.html',
  styleUrl: './policy-selection-form.component.scss',
})
export class PolicySelectionFormComponent {
  readonly groupId = input.required<number>();
  readonly isVisible = input.required<boolean>();
  readonly groupPolicies = input.required<Policy[]>();
  readonly editUser = input<DeviceUser | null>(null);
  policies: Policy[] = [];
  currentGroupPolicies: Policy[] = [];

  policy = output<Policy>();

  private policyService = inject(PolicyService);
  readonly loadingService = inject(LoadingService);

  private defaultFormValues = {
    policy: '',
  };

  policyForm = new FormGroup({
    policy: new FormControl(this.defaultFormValues.policy, [
      Validators.required,
    ]),
  });

  private getPolicies = effect(async () => {
    //list all users
    await this.policyService.listAll().subscribe({
      next: async ({ data }: Response<Policy[]>) => {
        this.policies = data;
        //Exclude those that are already in the group
        this.checkNewPolicies();
      },
      error: (err: any) => {
        console.error('error:', err);
      },
    });
  });

  private reloadGroupPolicies = effect(async () => {
    this.currentGroupPolicies = this.groupPolicies();
    this.checkNewPolicies();
  });

  private checkNewPolicies() {
    var newPolicies: Policy[] = [];
    this.policies.forEach((policy) => {
      if (!this.currentGroupPolicies.some((e) => policy.name === e.name)) {
        newPolicies.push(policy);
      }
    });

    this.policies = newPolicies;
    this.policyForm.setValue({ policy: this.policies[0]?.name ?? '' });
  }

  private setUserForm = effect(() => {
    this.resetForm();
  });

  private resetForm() {
    this.policyForm.reset(this.defaultFormValues);
  }

  private resetOnHide = effect(() => {
    if (!this.isVisible()) {
      this.resetForm();
    }
  });

  onSubmit() {
    if (this.policyForm.invalid) return;

    this.loadingService.showLoading();
    //We get the selected policy
    const policyToAdd = this.policies.find(
      (el: Policy) => el.name === this.policyForm.value.policy,
    );

    if (policyToAdd !== undefined) {
      this.policyService.linkToGroup(this.groupId(), policyToAdd).subscribe({
        next: ({ data }: Response<Policy>) => {
          this.policy.emit(data);
          this.resetForm();
          //Delete the item from currentGroupPolicies
          this.checkNewPolicies();
          this.loadingService.dismissLoading();
        },
        error: (err: any) => {
          console.error('error:', err);
          this.loadingService.dismissLoading();
        },
      });
    }
  }
}
