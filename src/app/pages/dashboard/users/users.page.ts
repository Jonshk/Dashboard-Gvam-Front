import { Component, effect, signal, viewChild } from '@angular/core';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListItemComponent } from './components/user-list-item/user-list-item.component';
import { DeviceUser } from '../../../core/models/response/device-user.model';
import { UserService } from '../../../core/services/user/user.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { Response } from '../../../core/models/response/response.model';
import { SuccessResponse } from '../../../core/models/response/success-response.model';
import { DeleteDialogComponent } from '../../../shared/component/delete-dialog/delete-dialog.component';
import { DialogComponent } from '../../../shared/component/dialog/dialog.component';
import { Group } from '../../../core/models/response/group.model';
import { GroupService } from '../../../core/services/group/group.service';
import { forkJoin } from 'rxjs';
import {
  Pagination,
  INITIAL_PAGE,
  DEFAULT_PAGINATION,
} from '../../../shared/util/pagination';
import { PaginatorComponent } from '../../../shared/component/paginator/paginator.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    DialogComponent,
    UserFormComponent,
    UserListItemComponent,
    DeleteDialogComponent,
    PaginatorComponent,
  ],
  templateUrl: './users.page.html',
  styleUrl: './users.page.scss',
})
export class UsersPage {
  paginator = viewChild(PaginatorComponent);

  users: DeviceUser[] = [];
  isAll: boolean = true;
  groups: Group[] = [];

  userToEdit: DeviceUser | null = null;
  userToDelete: DeviceUser | null = null;

  private _showDialog = signal(false);
  showDialog = this._showDialog.asReadonly();

  private _showSelectionDialog = signal(false);
  showSelectionDialog = this._showSelectionDialog.asReadonly();

  private _showDeleteDialog = signal(false);
  showDeleteDialog = this._showDeleteDialog.asReadonly();

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private loadingService: LoadingService,
  ) {}

  private listUsers = effect(
    () => {
      this.list();
    },
    { allowSignalWrites: true },
  );

  private list() {
    this.loadingService.setLoading();

    const pagination: Pagination = this.paginator()
      ? this.paginator()!.pagination
      : DEFAULT_PAGINATION;

    const $groups = this.groupService.list();
    const $users = this.userService.list(pagination);

    forkJoin([$groups, $users]).subscribe({
      next: ([{ data: groups }, { data: users }]) => {
        this.paginator()?.updateState({
          hasMoreItems: users.length === pagination.pageSize,
        });

        this.groups = groups;
        this.users = users;
        this.loadingService.dismissLoading();
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });
  }

  loadPaginatedUsers(pagination: Pagination) {
    this.loadingService.setLoading();
    const $users = this.userService.list(pagination);

    $users.subscribe({
      next: ({ data }: Response<DeviceUser[]>) => {
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

  editUser(editUser: DeviceUser) {
    this.userToEdit = editUser;
    this._showDialog.set(true);
  }

  addUser(user: DeviceUser) {
    const index = this.users.findIndex(
      (u) => u.deviceUserId === user.deviceUserId,
    );

    if (index !== -1) {
      this.users[index] = user;
      this.hideDialog();
      return;
    }

    this.users.push(user);
    this.hideDialog();
  }

  deleteUser(user: DeviceUser) {
    this.userToDelete = user;
    this._showDeleteDialog.set(true);
  }

  onDeleteConfirm(shouldDelete: boolean) {
    if (!shouldDelete || !this.userToDelete) return;

    this.loadingService.setLoading();
    this.userService.delete(this.userToDelete!.deviceUserId).subscribe({
      next: ({ data }: Response<SuccessResponse>) => {
        if (data.success) {
          this.users = this.users.filter(
            (u) => u.deviceUserId !== this.userToDelete!.deviceUserId,
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
