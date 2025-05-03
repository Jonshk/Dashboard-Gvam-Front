import { Component, signal, viewChild } from '@angular/core';
import { Group } from '../../../core/models/response/group.model';
import { GroupService } from '../../../core/services/group/group.service';
import { Response } from '../../../core/models/response/response.model';
import { RouterModule } from '@angular/router';
import { GroupFormComponent } from './components/group-form/group-form.component';
import { GroupListItemComponent } from './components/group-list-item/group-list-item.component';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { SuccessResponse } from '../../../core/models/response/success-response.model';
import { DeleteDialogComponent } from '../../../shared/component/delete-dialog/delete-dialog.component';
import { DialogComponent } from '../../../shared/component/dialog/dialog.component';
import { PaginatorComponent } from '../../../shared/component/paginator/paginator.component';
import {
  DEFAULT_PAGINATION,
  INITIAL_PAGE,
  Pagination,
} from '../../../shared/util/pagination';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    RouterModule,
    GroupFormComponent,
    GroupListItemComponent,
    DialogComponent,
    DeleteDialogComponent,
    PaginatorComponent,
  ],
  templateUrl: './groups.page.html',
  styleUrl: './groups.page.scss',
})
export class GroupsPage {
  paginator = viewChild(PaginatorComponent);

  groupToEdit: Group | null = null;
  groupToDelete: Group | null = null;

  groups: Group[] = [];

  private _showFormDialog = signal(false);
  showFormDialog = this._showFormDialog.asReadonly();

  private _showDeleteDialog = signal(false);
  showDeleteDialog = this._showDeleteDialog.asReadonly();
  layout: any;
  navmenu: any;
  hidenav: any;

  constructor(
    private groupService: GroupService,
    private loadingService: LoadingService,
  ) {
    this.list();
  }

  list() {
    this.loadingService.setLoading();

    const pagination: Pagination = this.paginator()
      ? this.paginator()!.pagination
      : DEFAULT_PAGINATION;

    this.groupService.list(pagination).subscribe({
      next: ({ data }: Response<Group[]>) => {
        if (data.length > 0) {
          this.groups = data;
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
    this.groupToEdit = null;
  }

  hideDeleteDialog() {
    this._showDeleteDialog.set(false);
  }

  createMode() {
    this._showFormDialog.set(true);
  }

  editGroup(group: Group) {
    this.groupToEdit = group;
    this._showFormDialog.set(true);
  }

  addGroup(group: Group) {
    const index = this.groups.findIndex((g) => g.groupId === group.groupId);

    if (index !== -1) {
      this.groups[index].groupName = group.groupName;
      this.hideFormDialog();
      return;
    }

    this.groups.push(group);
    this.hideFormDialog();
  }

  deleteGroup(group: Group) {
    this.groupToDelete = group;
    this._showDeleteDialog.set(true);
  }

  onDeleteConfirm(shouldDelete: boolean) {
    if (!shouldDelete || !this.groupToDelete) return;

    this.loadingService.setLoading();
    this.groupService.delete(this.groupToDelete.groupId).subscribe({
      next: ({ data }: Response<SuccessResponse>) => {
        if (data.success) {
          this.groups = this.groups.filter(
            (group) => group.groupId !== this.groupToDelete!.groupId,
          );
          this.groupToDelete = null;
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
