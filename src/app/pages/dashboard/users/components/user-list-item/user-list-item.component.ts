import { Component, inject, input, output } from '@angular/core';
import { DeviceUser } from '../../../../../core/models/response/device-user.model';
import { LoadingService } from '../../../../../core/services/loading/loading.service';

@Component({
  selector: 'app-user-list-item',
  standalone: true,
  imports: [],
  templateUrl: './user-list-item.component.html',
  styleUrl: './user-list-item.component.scss',
})
export class UserListItemComponent {
  readonly user = input.required<DeviceUser>();

  readonly onEditUser = output<DeviceUser>();
  readonly onDeleteUser = output<DeviceUser>();

  readonly loadingService = inject(LoadingService);

  editUser() {
    this.onEditUser.emit(this.user());
  }

  deleteUser() {
    this.onDeleteUser.emit(this.user());
  }
}
