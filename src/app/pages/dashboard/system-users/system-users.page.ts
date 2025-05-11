import { Component, signal, viewChild } from '@angular/core';
import { SystemUserService } from '../../../core/services/system-user/system-user.service';
import { Response } from '../../../core/models/response/response.model';
import { SystemUser } from '../../../core/models/response/system-user.model';
import { DialogComponent } from '../../../shared/component/dialog/dialog.component';
import { SystemUsersFormComponent } from './system-users-form/system-users-form.component';
import { DeleteDialogComponent } from '../../../shared/component/delete-dialog/delete-dialog.component';
import { SystemUsersListItemComponent } from './system-users-list-item/system-users-list-item.component';
import { SuccessResponse } from '../../../core/models/response/success-response.model';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { PaginatorComponent } from '../../../shared/component/paginator/paginator.component';
import {
  DEFAULT_PAGINATION,
  INITIAL_PAGE,
  Pagination,
} from '../../../shared/util/pagination';

@Component({
  selector: 'app-system-users',
  standalone: true,
  imports: [
    DialogComponent,
    SystemUsersFormComponent,
    DeleteDialogComponent,
    SystemUsersListItemComponent,
    PaginatorComponent,
  ],
  templateUrl: './system-users.page.html',
  styleUrl: './system-users.page.scss',
})
export class SystemUsersPage {
  paginator = viewChild(PaginatorComponent);

  users: SystemUser[] = [];

  userToEdit: SystemUser | null = null;
  userToDelete: SystemUser | null = null;

  private _showDialog = signal(false);
  showDialog = this._showDialog.asReadonly();

  private _showSelectionDialog = signal(false);
  showSelectionDialog = this._showSelectionDialog.asReadonly();

  private _showDeleteDialog = signal(false);
  showDeleteDialog = this._showDeleteDialog.asReadonly();

  constructor(
    private systemUserService: SystemUserService,
    private loadingService: LoadingService,
  ) {
    this.list();
  }

  list() {
    this.loadingService.setLoading();

    const pagination: Pagination = this.paginator()
      ? this.paginator()!.pagination
      : DEFAULT_PAGINATION;

    this.systemUserService.list(pagination).subscribe({
      next: ({ data }: Response<SystemUser[]>) => {
        if (data.length > 0) {
          this.users = data;
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

  hideDialog() {
    this._showDialog.set(false);
    this.userToEdit = null;
  }

  hideSelectionDialog() {
    this._showSelectionDialog.set(false);
    this.userToEdit = null;
  }

  hideDeleteDialog() {
    this._showDeleteDialog.set(false);
    this.userToDelete = null;
  }

  createMode() {
    this._showDialog.set(true);
  }

  addMode() {
    this._showSelectionDialog.set(true);
  }

  editUser(editUser: SystemUser) {
    this.userToEdit = editUser;
    this._showDialog.set(true);
  }

  addUser(user: SystemUser) {
    const index = this.users.findIndex((u) => u.userId === user.userId);

    if (index !== -1) {
      this.users[index] = user;
      this.hideDialog();
      return;
    }

    this.users.push(user);
    this.hideDialog();
  }

  deleteUser(user: SystemUser) {
    this.userToDelete = user;
    this._showDeleteDialog.set(true);
  }

  onDeleteConfirm(shouldDelete: boolean) {
    if (!shouldDelete || !this.userToDelete) return;

    this.loadingService.setLoading();
    this.systemUserService.delete(this.userToDelete!.userId).subscribe({
      next: ({ data }: Response<SuccessResponse>) => {
        if (data.success) {
          this.users = this.users.filter(
            (u) => u.userId !== this.userToDelete!.userId,
          );
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
}
