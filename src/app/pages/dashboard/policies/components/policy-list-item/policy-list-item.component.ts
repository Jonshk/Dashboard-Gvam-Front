import { Component, inject, input, output } from '@angular/core';
import { Policy } from '../../../../../core/models/response/policy.model';
import { PolicyService } from '../../../../../core/services/policy/policy.service';
import { SuccessResponse } from '../../../../../core/models/response/success-response.model';
import { Response } from '../../../../../core/models/response/response.model';
import { LoadingService } from '../../../../../core/services/loading/loading.service';
import { Group } from '../../../../../core/models/response/group.model';

@Component({
  selector: 'app-policy-list-item',
  standalone: true,
  imports: [],
  templateUrl: './policy-list-item.component.html',
  styleUrl: './policy-list-item.component.scss',
})
export class PolicyListItemComponent {
  readonly groupId = input.required<number>();
  readonly policy = input.required<Policy>();
  readonly groups = input.required<Group[]>();

  readonly onEditPolicy = output<Policy>();
  readonly onDeletePolicy = output<Policy>();
  readonly onUnlinkPolicy = output<Policy>();

  private policyService = inject(PolicyService);
  readonly loadingService = inject(LoadingService);

  editPolicy() {
    this.onEditPolicy.emit(this.policy());
  }

  deletePolicy() {
    this.onDeletePolicy.emit(this.policy());
  }

  unlinkPolicy() {
    this.onUnlinkPolicy.emit(this.policy());
  }

  applyPolicyToGroup() {
    this.loadingService.setLoading();
    const groupId = this.groupId();
    this.policyService
      .applyPolicyToGroup(groupId, this.policy().name)
      .subscribe({
        next: ({ data }: Response<SuccessResponse>) => {
          if (data) {
            console.log('Política aplicada');
          }
          this.loadingService.dismissLoading();
        },
        error: (err: any) => {
          console.error('error:', err);
          this.loadingService.dismissLoading();
        },
      });
  }

  getGroupName(groupId: number) {
    return this.groups().find((g) => g.groupId === groupId)?.groupName;
  }
}
