import { Component, inject, input, output } from '@angular/core';
import { SystemUser } from '../../../../core/models/response/system-user.model';
import { LoadingService } from '../../../../core/services/loading/loading.service';

@Component({
  selector: 'app-system-users-list-item',
  standalone: true,
  imports: [],
  templateUrl: './system-users-list-item.component.html',
  styleUrl: './system-users-list-item.component.scss',
})
export class SystemUsersListItemComponent {
  readonly user = input.required<SystemUser>();

  readonly onEditUser = output<SystemUser>();
  readonly onDeleteUser = output<SystemUser>();

  readonly loadingService = inject(LoadingService);

  editUser() {
    this.onEditUser.emit(this.user());
  }

  deleteUser() {
    this.onDeleteUser.emit(this.user());
  }
}
