import { Component, effect, input, signal, viewChild } from '@angular/core';
import { Policy } from '../../../core/models/response/policy.model';
import { PolicyService } from '../../../core/services/policy/policy.service';
import { Response } from '../../../core/models/response/response.model';
import { PolicyFormComponent } from './components/policy-form/policy-form.component';
import { PolicyListItemComponent } from './components/policy-list-item/policy-list-item.component';
import { PolicySelectionFormComponent } from './components/policy-selection-form/policy-selection-form.component';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { SuccessResponse } from '../../../core/models/response/success-response.model';
import { DeleteDialogComponent } from '../../../shared/component/delete-dialog/delete-dialog.component';
import { DialogComponent } from '../../../shared/component/dialog/dialog.component';
import { Group } from '../../../core/models/response/group.model';
import { GroupService } from '../../../core/services/group/group.service';
import { forkJoin } from 'rxjs';
import { PaginatorComponent } from '../../../shared/component/paginator/paginator.component';
import {
  DEFAULT_PAGINATION,
  INITIAL_PAGE,
  Pagination,
} from '../../../shared/util/pagination';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [
    PolicyFormComponent,
    PolicyListItemComponent,
    PolicySelectionFormComponent,
    DialogComponent,
    DeleteDialogComponent,
    PaginatorComponent,
  ],
  templateUrl: './policies.page.html',
  styleUrl: './policies.page.scss',
})
export class PoliciesPage {
  readonly groupId = input.required<number>();

  paginator = viewChild(PaginatorComponent);

  policies: Policy[] = [];
  groups: Group[] = [];

  policyToEdit: Policy | null = null;
  policyToDelete: Policy | null = null;
  policyToUnlink: Policy | null = null;

  private _showFormDialog = signal(false);
  showFormDialog = this._showFormDialog.asReadonly();

  private _showSelectionDialog = signal(false);
  showSelectionDialog = this._showSelectionDialog.asReadonly();

  private _showDeleteDialog = signal(false);
  showDeleteDialog = this._showDeleteDialog.asReadonly();

  private _showUnlinkDialog = signal(false);
  showUnlinkDialog = this._showUnlinkDialog.asReadonly();

  constructor(
    private policyService: PolicyService,
    private groupService: GroupService,
    private loadingService: LoadingService,
  ) {}

  private listPolicies = effect(
    () => {
      this.list();
    },
    { allowSignalWrites: true },
  );

  private list() {
    this.loadingService.setLoading();
    this.policies = [];

    const pagination: Pagination = this.paginator()
      ? this.paginator()!.pagination
      : DEFAULT_PAGINATION;

    const $groups = this.groupService.list();
    const $policies = this.groupId()
      ? this.policyService.list(this.groupId(), pagination)
      : this.policyService.listAll(pagination);

    forkJoin([$groups, $policies]).subscribe({
      next: ([{ data: groups }, { data: policies }]) => {
        this.paginator()?.updateState({
          hasMoreItems: policies.length === pagination.pageSize,
        });

        this.groups = groups;
        this.policies = policies;
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });
  }

  loadPaginatedPolicies(pagination: Pagination) {
    this.loadingService.setLoading();
    const $policies = this.groupId()
      ? this.policyService.list(this.groupId(), pagination)
      : this.policyService.listAll(pagination);

    $policies.subscribe({
      next: ({ data }: Response<Policy[]>) => {
        if (data.length > 0) {
          this.policies = data;
        }

        this.paginator()?.updateState({
          hasMoreItems: data.length === pagination.pageSize,
          hasLessItems: pagination.currentPage !== INITIAL_PAGE,
        });

        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });
  }

  hideFormDialog() {
    this._showFormDialog.set(false);
    this.policyToEdit = null;
  }

  hideSelectionDialog() {
    this._showSelectionDialog.set(false);
    this.policyToEdit = null;
  }

  hideDeleteDialog() {
    this._showDeleteDialog.set(false);
  }

  hideUnlinkDialog() {
    this._showUnlinkDialog.set(false);
  }

  createMode() {
    this._showFormDialog.set(true);
  }

  addMode() {
    this._showSelectionDialog.set(true);
  }

  editPolicy(editPolicy: Policy) {
    this.policyToEdit = editPolicy;
    this._showFormDialog.set(true);
  }

  addPolicy(policy: Policy) {
    if (policy.isDefault) {
      this.policies.forEach((p) => (p.isDefault = false));
    }
    const index = this.policies.findIndex((p) => p.name === policy.name);
    if (index !== -1) {
      this.policies[index] = policy;
      this.hideFormDialog();
      this.hideSelectionDialog();
      return;
    }

    this.policies.push(policy);
    this.hideFormDialog();
  }

  deletePolicy(policy: Policy) {
    this.policyToDelete = policy;
    this._showDeleteDialog.set(true);
  }

  unlinkPolicy(policy: Policy) {
    this.policyToUnlink = policy;
    this._showUnlinkDialog.set(true);
  }

  onDeleteConfirm(shouldDelete: boolean) {
    if (!shouldDelete || !this.policyToDelete) return;

    this.loadingService.setLoading();
    var groupId = this.groupId();
    if (groupId === undefined) {
      groupId = -1;
    }
    this.policyService.delete(groupId, this.policyToDelete.name).subscribe({
      next: ({ data }: Response<SuccessResponse>) => {
        if (data) {
          this.policies = this.policies.filter(
            (policy) => policy.name !== this.policyToDelete!.name,
          );
          this.policyToDelete = null;
          this.hideDeleteDialog();
        }
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
        this.hideDeleteDialog();
      },
    });
  }

  onUnlinkConfirm(shouldUnlink: boolean) {
    if (!shouldUnlink || !this.policyToUnlink) return;

    this.loadingService.setLoading();
    var groupId = this.groupId();
    this.policyService.unlinkFromGroup(groupId, this.policyToUnlink).subscribe({
      next: ({ data }: Response<Policy>) => {
        if (data) {
          this.policies = this.policies.filter(
            (policy) => policy.name !== this.policyToUnlink!.name,
          );
          this.policyToUnlink = null;
          this.hideUnlinkDialog();
        }
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
        this.hideUnlinkDialog();
      },
    });
  }
}
